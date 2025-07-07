// Google Drive download functionality for CMS content
import { googleDriveClient, ContentExport, GoogleDriveFile } from './googleDriveClient';

export interface DownloadResult {
  success: boolean;
  content: any;
  fileInfo: GoogleDriveFile;
  message: string;
  timestamp: number;
}

export interface DownloadProgress {
  stage: 'searching' | 'downloading' | 'validating' | 'applying' | 'complete' | 'error';
  message: string;
  progress?: number;
}

export class GoogleDriveDownloader {
  private static instance: GoogleDriveDownloader;
  private progressListeners: Array<(progress: DownloadProgress) => void> = [];

  private constructor() {}

  static getInstance(): GoogleDriveDownloader {
    if (!GoogleDriveDownloader.instance) {
      GoogleDriveDownloader.instance = new GoogleDriveDownloader();
    }
    return GoogleDriveDownloader.instance;
  }

  // Subscribe to download progress updates
  onProgress(listener: (progress: DownloadProgress) => void): () => void {
    this.progressListeners.push(listener);
    return () => {
      this.progressListeners = this.progressListeners.filter(l => l !== listener);
    };
  }

  private notifyProgress(progress: DownloadProgress): void {
    this.progressListeners.forEach(listener => listener(progress));
  }

  // Download content from Google Drive
  async downloadContent(options?: {
    fileId?: string;
    fileName?: string;
    applyToSite?: boolean;
  }): Promise<DownloadResult> {
    const fileId = options?.fileId || '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9';
    const fileName = options?.fileName || 'twofifths-content.json';
    const applyToSite = options?.applyToSite !== false; // Default to true

    try {
      // Stage 1: Searching
      this.notifyProgress({
        stage: 'searching',
        message: 'Searching for content file in Google Drive...',
        progress: 10
      });

      // Initialize Google Drive client if needed
      await googleDriveClient.initialize();

      // Check authentication
      const authStatus = googleDriveClient.getAuthStatus();
      if (!authStatus.isSignedIn) {
        throw new Error('Please sign in to Google Drive first');
      }

      // Find the file
      let fileInfo: GoogleDriveFile | null = null;

      // First try to get the specific file by ID
      try {
        fileInfo = await googleDriveClient.getFileInfo(fileId);
        if (fileInfo) {
          this.notifyProgress({
            stage: 'searching',
            message: `Found target file: ${fileInfo.name} (modified: ${new Date(fileInfo.modifiedTime).toLocaleString()})`,
            progress: 25
          });
        }
      } catch (directError) {
        console.log('Direct file access failed, searching by name...');
      }

      // Fallback: Search by name if direct access failed
      if (!fileInfo) {
        this.notifyProgress({
          stage: 'searching',
          message: `Searching for file by name: ${fileName}...`,
          progress: 20
        });

        const searchResults = await googleDriveClient.searchFiles(fileName);
        if (searchResults.length === 0) {
          throw new Error(`File '${fileName}' not found in Google Drive`);
        }

        // Get the most recent file
        fileInfo = searchResults[0];
        this.notifyProgress({
          stage: 'searching',
          message: `Found file by search: ${fileInfo.name} (modified: ${new Date(fileInfo.modifiedTime).toLocaleString()})`,
          progress: 25
        });
      }

      // Stage 2: Downloading
      this.notifyProgress({
        stage: 'downloading',
        message: `Downloading content from ${fileInfo.name}...`,
        progress: 40
      });

      const fileContent = await this.downloadFileContent(fileInfo.id);

      // Stage 3: Validating
      this.notifyProgress({
        stage: 'validating',
        message: 'Validating downloaded content...',
        progress: 70
      });

      const parsedContent = this.validateAndParseContent(fileContent);

      // Stage 4: Applying (if requested)
      if (applyToSite) {
        this.notifyProgress({
          stage: 'applying',
          message: 'Applying content to live site...',
          progress: 85
        });

        await this.applyContentToSite(parsedContent.content);
      }

      // Stage 5: Complete
      this.notifyProgress({
        stage: 'complete',
        message: `✅ Successfully downloaded and ${applyToSite ? 'applied' : 'validated'} content from Google Drive`,
        progress: 100
      });

      return {
        success: true,
        content: parsedContent.content,
        fileInfo: fileInfo,
        message: `Content successfully downloaded from Google Drive${applyToSite ? ' and applied to site' : ''}`,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('❌ Download failed:', error);
      
      this.notifyProgress({
        stage: 'error',
        message: `Download failed: ${error.message}`,
        progress: 0
      });

      throw new Error(`Download failed: ${error.message}`);
    }
  }

  // Download file content from Google Drive
  private async downloadFileContent(fileId: string): Promise<string> {
    // Get access token
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('Could not get access token');
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  }

  // Validate and parse downloaded content
  private validateAndParseContent(fileContent: string): ContentExport {
    let parsedContent: any;

    try {
      parsedContent = JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error('Invalid JSON format in downloaded file');
    }

    // Validate the content structure
    if (!parsedContent.type || parsedContent.type !== 'twofifths-cms-export') {
      throw new Error('Invalid file format - not a Two Fifths CMS export');
    }

    if (!parsedContent.content) {
      throw new Error('No content found in export file');
    }

    // Validate required content sections
    const content = parsedContent.content;
    if (!content.hero || !content.about || !content.testimonials) {
      throw new Error('Invalid content structure - missing required sections');
    }

    // Validate hero section
    if (!content.hero.headline || !content.hero.subheadline || !content.hero.ctaText) {
      throw new Error('Invalid hero section in content');
    }

    // Validate testimonials
    if (!Array.isArray(content.testimonials)) {
      throw new Error('Invalid testimonials format');
    }

    return parsedContent as ContentExport;
  }

  // Apply content to the live site
  private async applyContentToSite(content: any): Promise<void> {
    try {
      // Method 1: Update localStorage for immediate effect
      localStorage.setItem('twofifths-live-content', JSON.stringify(content));
      
      // Method 2: Broadcast to all open tabs/windows
      const channel = new BroadcastChannel('twofifths-content-updates');
      channel.postMessage({
        type: 'GOOGLE_DRIVE_CONTENT_UPDATED',
        content: content,
        timestamp: Date.now(),
        source: 'google-drive-download'
      });
      channel.close();

      // Method 3: Dispatch storage event for same-origin communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'twofifths-live-content',
        newValue: JSON.stringify(content),
        url: window.location.href
      }));

      // Method 4: Try to communicate with parent window if in iframe
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'GOOGLE_DRIVE_CONTENT_UPDATED',
          content: content,
          timestamp: Date.now()
        }, '*');
      }

      console.log('✅ Content applied to site via multiple channels');
    } catch (error) {
      console.warn('Warning: Could not apply content to site:', error);
      // Don't throw here - the download was successful even if application failed
    }
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

  // Check for updates (compare timestamps)
  async checkForUpdates(options?: {
    fileId?: string;
    fileName?: string;
    lastKnownTimestamp?: number;
  }): Promise<{
    hasUpdates: boolean;
    fileInfo: GoogleDriveFile | null;
    message: string;
  }> {
    try {
      await googleDriveClient.initialize();

      const authStatus = googleDriveClient.getAuthStatus();
      if (!authStatus.isSignedIn) {
        return {
          hasUpdates: false,
          fileInfo: null,
          message: 'Not signed in to Google Drive'
        };
      }

      const fileId = options?.fileId || '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9';
      const fileName = options?.fileName || 'twofifths-content.json';
      const lastKnownTimestamp = options?.lastKnownTimestamp;

      // Try to get file info
      let fileInfo: GoogleDriveFile | null = null;

      try {
        fileInfo = await googleDriveClient.getFileInfo(fileId);
      } catch (error) {
        // Fallback to search
        const searchResults = await googleDriveClient.searchFiles(fileName);
        if (searchResults.length > 0) {
          fileInfo = searchResults[0];
        }
      }

      if (!fileInfo) {
        return {
          hasUpdates: false,
          fileInfo: null,
          message: 'Content file not found in Google Drive'
        };
      }

      // Compare timestamps if provided
      if (lastKnownTimestamp) {
        const fileTimestamp = new Date(fileInfo.modifiedTime).getTime();
        const hasUpdates = fileTimestamp > lastKnownTimestamp;

        return {
          hasUpdates,
          fileInfo,
          message: hasUpdates 
            ? `Updates available (file modified: ${new Date(fileInfo.modifiedTime).toLocaleString()})`
            : 'No updates available'
        };
      }

      return {
        hasUpdates: true, // Assume updates if no timestamp to compare
        fileInfo,
        message: `File found (modified: ${new Date(fileInfo.modifiedTime).toLocaleString()})`
      };

    } catch (error) {
      console.error('Error checking for updates:', error);
      return {
        hasUpdates: false,
        fileInfo: null,
        message: `Error checking updates: ${error.message}`
      };
    }
  }
}

// Export singleton instance
export const googleDriveDownloader = GoogleDriveDownloader.getInstance();