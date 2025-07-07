// Automatic Google Drive content synchronization for live website
import { contentManager } from './contentManager';

export interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
  fileId: string;
  fileName: string;
  checkInterval: number; // milliseconds
}

export interface SyncStatus {
  isRunning: boolean;
  lastCheck: number | null;
  lastSync: number | null;
  lastError: string | null;
  checksPerformed: number;
  successfulSyncs: number;
}

class GoogleDriveAutoSync {
  private static instance: GoogleDriveAutoSync;
  private config: GoogleDriveConfig;
  private status: SyncStatus;
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private authInstance: any = null;

  private constructor() {
    this.config = {
      clientId: '652780960725-bfl3u5e0fa2nus1k41lqnp1u27i3b6ct.apps.googleusercontent.com',
      apiKey: 'AIzaSyAan9fk4Xe6U4BPWRIaA9Y5gTrWh2DShPk',
      fileId: '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9',
      fileName: 'twofifths-content.json',
      checkInterval: 30000 // 30 seconds
    };

    this.status = {
      isRunning: false,
      lastCheck: null,
      lastSync: null,
      lastError: null,
      checksPerformed: 0,
      successfulSyncs: 0
    };
  }

  static getInstance(): GoogleDriveAutoSync {
    if (!GoogleDriveAutoSync.instance) {
      GoogleDriveAutoSync.instance = new GoogleDriveAutoSync();
    }
    return GoogleDriveAutoSync.instance;
  }

  // Initialize Google Drive API for background sync
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('🔄 Initializing Google Drive auto-sync...');

      // Load Google API if not already loaded
      await this.loadGoogleAPI();

      // Initialize gapi client
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.config.apiKey,
              clientId: this.config.clientId,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
              scope: 'https://www.googleapis.com/auth/drive.file'
            });

            this.authInstance = window.gapi.auth2.getAuthInstance();
            this.isInitialized = true;
            console.log('✅ Google Drive auto-sync initialized');
            resolve();
          } catch (error) {
            // Handle authentication/origin errors gracefully
            if (error.error === 'idpiframe_initialization_failed' || 
                (error.details && error.details.includes('Not a valid origin'))) {
              console.warn('⚠️ Google Drive auto-sync disabled: Origin not authorized for OAuth client');
              console.log('ℹ️ To enable Google Drive sync, add this origin to the OAuth client in Google Cloud Console');
              this.status.lastError = 'Origin not authorized - Google Drive sync disabled';
              // Don't reject - just disable the feature
              resolve();
              return;
            }
            console.error('❌ Failed to initialize Google Drive auto-sync:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      // Handle initialization errors gracefully
      if (error.error === 'idpiframe_initialization_failed' || 
          (error.details && error.details.includes('Not a valid origin'))) {
        console.warn('⚠️ Google Drive auto-sync disabled: Origin not authorized for OAuth client');
        console.log('ℹ️ To enable Google Drive sync, add this origin to the OAuth client in Google Cloud Console');
        this.status.lastError = 'Origin not authorized - Google Drive sync disabled';
        return; // Don't throw - just disable the feature
      }
      console.error('❌ Google Drive auto-sync initialization failed:', error);
      this.status.lastError = error.message || 'Initialization failed';
      throw error;
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.gapi) {
        resolve();
        return;
      }

      // Check if script already exists
      if (document.querySelector('script[src*="apis.google.com"]')) {
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

  // Start automatic synchronization
  start(): void {
    if (this.status.isRunning) {
      console.log('Google Drive auto-sync already running');
      return;
    }

    if (!this.isInitialized) {
      console.warn('Google Drive auto-sync not initialized. Call initialize() first.');
      return;
    }

    // Check if we have an auth error that should prevent starting
    if (this.status.lastError && this.status.lastError.includes('Origin not authorized')) {
      console.log('🔐 Google Drive auto-sync disabled due to authorization issues');
      return;
    }

    this.status.isRunning = true;
    console.log(`🔄 Starting Google Drive auto-sync (checking every ${this.config.checkInterval / 1000}s)`);

    // Start the sync interval
    this.syncInterval = setInterval(() => {
      this.performSyncCheck();
    }, this.config.checkInterval);

    // Perform initial check
    this.performSyncCheck();
  }

  // Stop automatic synchronization
  stop(): void {
    if (!this.status.isRunning) {
      return;
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.status.isRunning = false;
    console.log('⏹️ Google Drive auto-sync stopped');
  }

  // Perform a sync check
  private async performSyncCheck(): Promise<void> {
    if (!this.status.isRunning || !this.isInitialized) {
      return;
    }

    try {
      this.status.lastCheck = Date.now();
      this.status.checksPerformed++;

      console.log('🔍 Checking Google Drive for content updates...');

      // Check if we can access the file without authentication
      const hasUpdates = await this.checkForUpdates();
      
      if (hasUpdates) {
        console.log('📥 Updates detected, downloading content...');
        await this.downloadAndApplyContent();
      } else {
        console.log('✅ No updates found');
      }

      this.status.lastError = null;
    } catch (error) {
      console.warn('⚠️ Google Drive sync check failed:', error.message);
      this.status.lastError = error.message;
      
      // Don't spam errors - only log occasionally
      if (this.status.checksPerformed % 10 === 0) {
        console.error('❌ Persistent Google Drive sync issues:', error);
      }
    }
  }

  // Check for updates without requiring authentication
  private async checkForUpdates(): Promise<boolean> {
    try {
      // Get the last known sync timestamp
      const lastSyncTimestamp = this.getLastSyncTimestamp();
      
      // Try to get file info using API key only (public access)
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${this.config.fileId}?fields=modifiedTime&key=${this.config.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const fileInfo = await response.json();
        const fileTimestamp = new Date(fileInfo.modifiedTime).getTime();
        
        // Compare with last known timestamp
        if (fileTimestamp > lastSyncTimestamp) {
          console.log(`📅 File updated: ${new Date(fileInfo.modifiedTime).toLocaleString()}`);
          return true;
        }
        
        return false;
      } else if (response.status === 403 || response.status === 401) {
        // File is not publicly accessible, try with authentication
        return await this.checkForUpdatesWithAuth();
      } else {
        throw new Error(`File check failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn('File check failed, trying with authentication:', error.message);
      return await this.checkForUpdatesWithAuth();
    }
  }

  // Check for updates with authentication
  private async checkForUpdatesWithAuth(): Promise<boolean> {
    if (!this.authInstance) {
      return false;
    }

    try {
      // Check if we're signed in
      if (!this.authInstance.isSignedIn.get()) {
        // Try silent sign-in for background sync
        try {
          await this.authInstance.signIn({ prompt: 'none' });
        } catch (signInError) {
          // Silent sign-in failed, skip this check
          console.log('🔐 Silent sign-in failed, skipping authenticated check');
          return false;
        }
      }

      // Get file info using authenticated API
      const response = await window.gapi.client.drive.files.get({
        fileId: this.config.fileId,
        fields: 'modifiedTime'
      });

      if (response.status === 200) {
        const fileInfo = response.result;
        const fileTimestamp = new Date(fileInfo.modifiedTime).getTime();
        const lastSyncTimestamp = this.getLastSyncTimestamp();
        
        if (fileTimestamp > lastSyncTimestamp) {
          console.log(`📅 File updated (auth): ${new Date(fileInfo.modifiedTime).toLocaleString()}`);
          return true;
        }
        
        return false;
      } else {
        throw new Error(`Authenticated file check failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Authenticated file check failed:', error.message);
      return false;
    }
  }

  // Download and apply content
  private async downloadAndApplyContent(): Promise<void> {
    try {
      // First try public download
      let fileContent: string;
      
      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${this.config.fileId}?alt=media&key=${this.config.apiKey}`,
          {
            method: 'GET'
          }
        );

        if (response.ok) {
          fileContent = await response.text();
        } else {
          throw new Error(`Public download failed: ${response.status}`);
        }
      } catch (publicError) {
        console.log('Public download failed, trying authenticated download...');
        fileContent = await this.downloadWithAuth();
      }

      // Parse and validate content
      const parsedData = JSON.parse(fileContent);
      
      if (!parsedData.type || parsedData.type !== 'twofifths-cms-export') {
        throw new Error('Invalid file format');
      }

      if (!parsedData.content) {
        throw new Error('No content found in file');
      }

      // Apply content to the site
      console.log('📝 Applying downloaded content to site...');
      contentManager.updateContent(parsedData.content);
      
      // Also store for persistence
      localStorage.setItem('twofifths-google-drive-auto-sync', JSON.stringify({
        content: parsedData.content,
        timestamp: Date.now(),
        source: 'auto-sync',
        processed: false
      }));

      // Update sync timestamp
      this.updateLastSyncTimestamp(parsedData.timestamp || Date.now());
      
      this.status.lastSync = Date.now();
      this.status.successfulSyncs++;
      
      console.log('✅ Content successfully synchronized from Google Drive');

      // Broadcast the update
      const channel = new BroadcastChannel('twofifths-content-updates');
      channel.postMessage({
        type: 'GOOGLE_DRIVE_CONTENT_UPDATED',
        content: parsedData.content,
        timestamp: Date.now(),
        source: 'auto-sync'
      });
      channel.close();

    } catch (error) {
      console.error('❌ Failed to download and apply content:', error);
      throw error;
    }
  }

  // Download with authentication
  private async downloadWithAuth(): Promise<string> {
    if (!this.authInstance || !this.authInstance.isSignedIn.get()) {
      throw new Error('Not authenticated for download');
    }

    const user = this.authInstance.currentUser.get();
    const accessToken = user.getAuthResponse().access_token;

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${this.config.fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Authenticated download failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  }

  // Get last sync timestamp
  private getLastSyncTimestamp(): number {
    try {
      const stored = localStorage.getItem('twofifths-google-drive-last-sync');
      return stored ? parseInt(stored) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Update last sync timestamp
  private updateLastSyncTimestamp(timestamp: number): void {
    try {
      localStorage.setItem('twofifths-google-drive-last-sync', timestamp.toString());
    } catch (error) {
      console.warn('Failed to update sync timestamp:', error);
    }
  }

  // Get current status
  getStatus(): SyncStatus {
    return { ...this.status };
  }

  // Manual sync trigger
  async triggerManualSync(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log('🔄 Manual sync triggered...');
    await this.performSyncCheck();
  }
}

// Export singleton instance
export const googleDriveAutoSync = GoogleDriveAutoSync.getInstance();

// Auto-start the sync when this module is imported
if (typeof window !== 'undefined') {
  // Initialize and start auto-sync after a short delay
  setTimeout(async () => {
    try {
      await googleDriveAutoSync.initialize();
      googleDriveAutoSync.start();
    } catch (error) {
      console.warn('Failed to auto-start Google Drive sync:', error);
    }
  }, 2000); // 2 second delay to let the page load
}