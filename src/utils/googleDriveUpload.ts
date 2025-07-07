// Google Drive upload functionality for CMS content
import { googleDriveClient, ContentExport } from './googleDriveClient';

export interface UploadResult {
  success: boolean;
  fileId: string;
  fileName: string;
  message: string;
  timestamp: number;
}

export interface UploadProgress {
  stage: 'preparing' | 'uploading' | 'verifying' | 'complete' | 'error';
  message: string;
  progress?: number;
}

export class GoogleDriveUploader {
  private static instance: GoogleDriveUploader;
  private progressListeners: Array<(progress: UploadProgress) => void> = [];

  private constructor() {}

  static getInstance(): GoogleDriveUploader {
    if (!GoogleDriveUploader.instance) {
      GoogleDriveUploader.instance = new GoogleDriveUploader();
    }
    return GoogleDriveUploader.instance;
  }

  // Subscribe to upload progress updates
  onProgress(listener: (progress: UploadProgress) => void): () => void {
    this.progressListeners.push(listener);
    return () => {
      this.progressListeners = this.progressListeners.filter(l => l !== listener);
    };
  }

  private notifyProgress(progress: UploadProgress): void {
    this.progressListeners.forEach(listener => listener(progress));
  }

  // Upload content to Google Drive
  async uploadContent(content: any, options?: {
    fileName?: string;
    fileId?: string;
    description?: string;
  }): Promise<UploadResult> {
    const fileName = options?.fileName || 'twofifths-content.json';
    const targetFileId = options?.fileId || '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9';
    const description = options?.description || 'Two Fifths CMS Content - Auto-generated backup';

    try {
      // Stage 1: Preparing
      this.notifyProgress({
        stage: 'preparing',
        message: 'Preparing content for upload...',
        progress: 10
      });

      // Initialize Google Drive client if needed
      await googleDriveClient.initialize();

      // Check authentication
      const authStatus = googleDriveClient.getAuthStatus();
      if (!authStatus.isSignedIn) {
        throw new Error('Please sign in to Google Drive first');
      }

      // Prepare the export data
      const exportData: ContentExport = {
        type: 'twofifths-cms-export',
        version: '1.0.0',
        timestamp: Date.now(),
        content: content,
        metadata: {
          exportedBy: 'Two Fifths CMS',
          exportedAt: new Date().toISOString(),
          source: 'google-drive-upload',
          fileId: targetFileId
        }
      };

      const fileContent = JSON.stringify(exportData, null, 2);

      this.notifyProgress({
        stage: 'preparing',
        message: 'Content prepared, checking existing file...',
        progress: 25
      });

      // Stage 2: Check if file exists and determine upload method
      let uploadMethod: 'create' | 'update' = 'create';
      let uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

      try {
        const existingFile = await googleDriveClient.getFileInfo(targetFileId);
        if (existingFile) {
          uploadMethod = 'update';
          uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${targetFileId}?uploadType=multipart`;
          this.notifyProgress({
            stage: 'preparing',
            message: `Found existing file: ${existingFile.name}. Will update it.`,
            progress: 40
          });
        } else {
          this.notifyProgress({
            stage: 'preparing',
            message: 'No existing file found. Will create new file.',
            progress: 40
          });
        }
      } catch (checkError) {
        console.warn('Could not check existing file, will attempt to create new one:', checkError);
        this.notifyProgress({
          stage: 'preparing',
          message: 'Could not verify existing file. Will create new file.',
          progress: 40
        });
      }

      // Stage 3: Upload
      this.notifyProgress({
        stage: 'uploading',
        message: `${uploadMethod === 'update' ? 'Updating' : 'Creating'} file in Google Drive...`,
        progress: 50
      });

      const result = await this.performUpload(
        uploadUrl,
        uploadMethod === 'update' ? 'PATCH' : 'POST',
        fileContent,
        fileName,
        description
      );

      // Stage 4: Verify
      this.notifyProgress({
        stage: 'verifying',
        message: 'Verifying upload...',
        progress: 85
      });

      // Verify the upload by checking the file
      const verificationFile = await googleDriveClient.getFileInfo(result.id);
      if (!verificationFile) {
        throw new Error('Upload verification failed - file not found');
      }

      // Stage 5: Complete
      this.notifyProgress({
        stage: 'complete',
        message: `✅ Successfully ${uploadMethod === 'update' ? 'updated' : 'created'} file: ${result.name}`,
        progress: 100
      });

      return {
        success: true,
        fileId: result.id,
        fileName: result.name,
        message: `Content successfully ${uploadMethod === 'update' ? 'updated' : 'uploaded'} to Google Drive`,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      this.notifyProgress({
        stage: 'error',
        message: `Upload failed: ${error.message}`,
        progress: 0
      });

      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Perform the actual upload using multipart request
  private async performUpload(
    uploadUrl: string,
    method: 'POST' | 'PATCH',
    fileContent: string,
    fileName: string,
    description: string
  ): Promise<any> {
    // Get access token
    const authStatus = googleDriveClient.getAuthStatus();
    if (!authStatus.isSignedIn) {
      throw new Error('Not authenticated');
    }

    // Get access token using reflection (since getAccessToken is private)
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('Could not get access token');
    }

    // Prepare multipart request
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const metadata = {
      'name': fileName,
      'description': description,
      'parents': [] // Root folder
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      close_delim;

    // Perform the upload
    const response = await fetch(uploadUrl, {
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`
      },
      body: multipartRequestBody
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (parseError) {
        // Use the default error message
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // Get access token (workaround for private method)
  private async getAccessToken(): Promise<string | null> {
    try {
      // Access the auth instance through the global gapi object
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance && authInstance.isSignedIn.get()) {
          const user = authInstance.currentUser.get();
          return user.getAuthResponse().access_token;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Upload with retry logic
  async uploadWithRetry(
    content: any,
    options?: {
      fileName?: string;
      fileId?: string;
      description?: string;
      maxRetries?: number;
      retryDelay?: number;
    }
  ): Promise<UploadResult> {
    const maxRetries = options?.maxRetries || 3;
    const retryDelay = options?.retryDelay || 2000;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.notifyProgress({
          stage: 'preparing',
          message: attempt > 1 ? `Retry attempt ${attempt}/${maxRetries}...` : 'Starting upload...',
          progress: 0
        });

        return await this.uploadContent(content, options);
      } catch (error) {
        lastError = error;
        console.warn(`Upload attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          this.notifyProgress({
            stage: 'preparing',
            message: `Attempt ${attempt} failed. Retrying in ${retryDelay/1000} seconds...`,
            progress: 0
          });

          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All attempts failed
    this.notifyProgress({
      stage: 'error',
      message: `All ${maxRetries} upload attempts failed: ${lastError.message}`,
      progress: 0
    });

    throw lastError;
  }

  // Batch upload multiple content versions
  async uploadBatch(
    contentVersions: Array<{
      content: any;
      fileName: string;
      description?: string;
    }>,
    options?: {
      concurrent?: boolean;
      maxConcurrent?: number;
    }
  ): Promise<UploadResult[]> {
    const concurrent = options?.concurrent || false;
    const maxConcurrent = options?.maxConcurrent || 3;

    if (concurrent) {
      // Upload concurrently with limit
      const results: UploadResult[] = [];
      const chunks = this.chunkArray(contentVersions, maxConcurrent);

      for (const chunk of chunks) {
        const chunkPromises = chunk.map(version =>
          this.uploadContent(version.content, {
            fileName: version.fileName,
            description: version.description
          })
        );

        const chunkResults = await Promise.allSettled(chunkPromises);
        
        for (const result of chunkResults) {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            console.error('Batch upload item failed:', result.reason);
            throw result.reason;
          }
        }
      }

      return results;
    } else {
      // Upload sequentially
      const results: UploadResult[] = [];
      
      for (let i = 0; i < contentVersions.length; i++) {
        const version = contentVersions[i];
        
        this.notifyProgress({
          stage: 'uploading',
          message: `Uploading file ${i + 1}/${contentVersions.length}: ${version.fileName}`,
          progress: (i / contentVersions.length) * 100
        });

        const result = await this.uploadContent(version.content, {
          fileName: version.fileName,
          description: version.description
        });
        
        results.push(result);
      }

      return results;
    }
  }

  // Utility method to chunk array
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

// Export singleton instance
export const googleDriveUploader = GoogleDriveUploader.getInstance();