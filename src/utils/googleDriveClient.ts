// Google Drive API client for content synchronization
export interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
  fileId: string;
  fileName: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
}

export interface ContentExport {
  type: 'twofifths-cms-export';
  version: string;
  timestamp: number;
  content: any;
  metadata: {
    exportedBy: string;
    exportedAt: string;
    source: string;
    fileId?: string;
  };
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export class GoogleDriveClient {
  private static instance: GoogleDriveClient;
  private isInitialized = false;
  private isSignedIn = false;
  private authInstance: any = null;
  
  // Configuration
  private readonly config: GoogleDriveConfig = {
    clientId: '652780960725-bfl3u5e0fa2nus1k41lqnp1u27i3b6ct.apps.googleusercontent.com',
    apiKey: 'AIzaSyAan9fk4Xe6U4BPWRIaA9Y5gTrWh2DShPk',
    fileId: '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9',
    fileName: 'twofifths-content.json'
  };
  
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';

  private constructor() {}

  static getInstance(): GoogleDriveClient {
    if (!GoogleDriveClient.instance) {
      GoogleDriveClient.instance = new GoogleDriveClient();
    }
    return GoogleDriveClient.instance;
  }

  // Initialize Google API
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Load Google API script if not already loaded
      await this.loadGoogleAPI();

      // Initialize gapi
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.config.apiKey,
              clientId: this.config.clientId,
              discoveryDocs: [this.DISCOVERY_DOC],
              scope: this.SCOPES
            });

            this.authInstance = window.gapi.auth2.getAuthInstance();
            this.isSignedIn = this.authInstance.isSignedIn.get();
            
            // Listen for sign-in state changes
            this.authInstance.isSignedIn.listen((signedIn: boolean) => {
              this.isSignedIn = signedIn;
              this.notifyAuthStateChange(signedIn);
            });
            
            this.isInitialized = true;
            console.log('✅ Google Drive API initialized');
            resolve();
          } catch (error) {
            console.error('❌ Error initializing Google API:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('❌ Error loading Google API:', error);
      throw new Error('Failed to initialize Google Drive API');
    }
  }

  // Load Google API script dynamically
  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.gapi) {
        resolve();
        return;
      }

      // Check if script tag already exists
      if (document.querySelector('script[src*="apis.google.com"]')) {
        // Wait for it to load
        const checkGapi = () => {
          if (window.gapi) {
            resolve();
          } else {
            setTimeout(checkGapi, 100);
          }
        };
        checkGapi();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  // Authentication methods
  async signIn(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isSignedIn) {
      return;
    }

    try {
      await this.authInstance.signIn();
      this.isSignedIn = true;
      console.log('✅ Signed in to Google Drive');
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
      throw new Error('Failed to sign in to Google Drive');
    }
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized || !this.isSignedIn) {
      return;
    }

    try {
      await this.authInstance.signOut();
      this.isSignedIn = false;
      console.log('✅ Signed out from Google Drive');
    } catch (error) {
      console.error('❌ Sign-out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get current authentication status
  getAuthStatus(): { isInitialized: boolean; isSignedIn: boolean } {
    return {
      isInitialized: this.isInitialized,
      isSignedIn: this.isSignedIn
    };
  }

  // Get OAuth2 access token
  private getAccessToken(): string | null {
    if (!this.isSignedIn || !this.authInstance) {
      return null;
    }
    
    const user = this.authInstance.currentUser.get();
    return user.getAuthResponse().access_token;
  }

  // Check if file exists and get its info
  async getFileInfo(fileId: string = this.config.fileId): Promise<GoogleDriveFile | null> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,modifiedTime,size`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return null; // File doesn't exist
      } else {
        throw new Error(`Failed to get file info: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error getting file info:', error);
      throw error;
    }
  }

  // Search for files by name
  async searchFiles(fileName: string = this.config.fileName): Promise<GoogleDriveFile[]> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${fileName}'&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.files || [];
    } catch (error) {
      console.error('❌ Error searching files:', error);
      throw error;
    }
  }

  // Notify auth state changes (for UI updates)
  private authStateListeners: Array<(isSignedIn: boolean) => void> = [];

  onAuthStateChange(listener: (isSignedIn: boolean) => void): () => void {
    this.authStateListeners.push(listener);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  private notifyAuthStateChange(isSignedIn: boolean): void {
    this.authStateListeners.forEach(listener => listener(isSignedIn));
  }
}

// Export singleton instance
export const googleDriveClient = GoogleDriveClient.getInstance();