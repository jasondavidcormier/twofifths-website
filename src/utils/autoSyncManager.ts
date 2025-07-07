// Automatic synchronization manager for Google Drive content
import { googleDriveDownloader, DownloadResult } from './googleDriveDownload';
import { contentManager } from './contentManager';

export interface AutoSyncConfig {
  enabled: boolean;
  interval: number; // milliseconds
  fileId?: string;
  fileName?: string;
  maxRetries: number;
  retryDelay: number;
  onUpdate?: (result: DownloadResult) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: AutoSyncStatus) => void;
}

export interface AutoSyncStatus {
  isRunning: boolean;
  lastCheck: number | null;
  lastSync: number | null;
  lastError: string | null;
  nextCheck: number | null;
  checksPerformed: number;
  successfulSyncs: number;
  failedSyncs: number;
}

export interface AutoSyncEvent {
  type: 'started' | 'stopped' | 'checking' | 'syncing' | 'success' | 'error' | 'no-updates';
  timestamp: number;
  message: string;
  data?: any;
}

export class AutoSyncManager {
  private static instance: AutoSyncManager;
  private config: AutoSyncConfig;
  private status: AutoSyncStatus;
  private syncInterval: NodeJS.Timeout | null = null;
  private eventListeners: Array<(event: AutoSyncEvent) => void> = [];
  private isInitialized = false;

  // Default configuration
  private static readonly DEFAULT_CONFIG: AutoSyncConfig = {
    enabled: false,
    interval: 30000, // 30 seconds
    fileId: '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9',
    fileName: 'twofifths-content.json',
    maxRetries: 3,
    retryDelay: 5000 // 5 seconds
  };

  private static readonly DEFAULT_STATUS: AutoSyncStatus = {
    isRunning: false,
    lastCheck: null,
    lastSync: null,
    lastError: null,
    nextCheck: null,
    checksPerformed: 0,
    successfulSyncs: 0,
    failedSyncs: 0
  };

  private constructor() {
    this.config = { ...AutoSyncManager.DEFAULT_CONFIG };
    this.status = { ...AutoSyncManager.DEFAULT_STATUS };
    this.loadConfiguration();
  }

  static getInstance(): AutoSyncManager {
    if (!AutoSyncManager.instance) {
      AutoSyncManager.instance = new AutoSyncManager();
    }
    return AutoSyncManager.instance;
  }

  // Initialize the auto-sync manager
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Load saved configuration
      this.loadConfiguration();
      
      // Initialize Google Drive downloader
      await googleDriveDownloader.onProgress((progress) => {
        if (progress.stage === 'complete') {
          this.emitEvent({
            type: 'success',
            timestamp: Date.now(),
            message: 'Content synchronized successfully',
            data: { stage: progress.stage, message: progress.message }
          });
        } else if (progress.stage === 'error') {
          this.emitEvent({
            type: 'error',
            timestamp: Date.now(),
            message: progress.message,
            data: { stage: progress.stage }
          });
        }
      });

      this.isInitialized = true;
      console.log('✅ AutoSyncManager initialized');

      // Start auto-sync if enabled
      if (this.config.enabled) {
        this.start();
      }
    } catch (error) {
      console.error('❌ Failed to initialize AutoSyncManager:', error);
      throw error;
    }
  }

  // Load configuration from localStorage
  private loadConfiguration(): void {
    try {
      const savedConfig = localStorage.getItem('twofifths-autosync-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...AutoSyncManager.DEFAULT_CONFIG, ...parsed };
      }

      const savedStatus = localStorage.getItem('twofifths-autosync-status');
      if (savedStatus) {
        const parsed = JSON.parse(savedStatus);
        this.status = { ...AutoSyncManager.DEFAULT_STATUS, ...parsed };
        // Don't restore running state - always start fresh
        this.status.isRunning = false;
      }
    } catch (error) {
      console.warn('Failed to load auto-sync configuration:', error);
      this.config = { ...AutoSyncManager.DEFAULT_CONFIG };
      this.status = { ...AutoSyncManager.DEFAULT_STATUS };
    }
  }

  // Save configuration to localStorage
  private saveConfiguration(): void {
    try {
      localStorage.setItem('twofifths-autosync-config', JSON.stringify(this.config));
      localStorage.setItem('twofifths-autosync-status', JSON.stringify(this.status));
    } catch (error) {
      console.warn('Failed to save auto-sync configuration:', error);
    }
  }

  // Get current configuration
  getConfig(): AutoSyncConfig {
    return { ...this.config };
  }

  // Get current status
  getStatus(): AutoSyncStatus {
    return { ...this.status };
  }

  // Update configuration
  updateConfig(newConfig: Partial<AutoSyncConfig>): void {
    const wasRunning = this.status.isRunning;
    
    // Stop if running
    if (wasRunning) {
      this.stop();
    }

    // Update configuration
    this.config = { ...this.config, ...newConfig };
    this.saveConfiguration();

    this.emitEvent({
      type: 'started',
      timestamp: Date.now(),
      message: 'Configuration updated',
      data: { config: this.config }
    });

    // Restart if it was running and still enabled
    if (wasRunning && this.config.enabled) {
      this.start();
    }
  }

  // Start automatic synchronization
  start(): void {
    if (!this.isInitialized) {
      console.warn('AutoSyncManager not initialized. Call initialize() first.');
      return;
    }

    if (this.status.isRunning) {
      console.log('Auto-sync already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('Auto-sync is disabled');
      return;
    }

    this.status.isRunning = true;
    this.status.nextCheck = Date.now() + this.config.interval;
    this.saveConfiguration();

    // Start the sync interval
    this.syncInterval = setInterval(() => {
      this.performSyncCheck();
    }, this.config.interval);

    this.emitEvent({
      type: 'started',
      timestamp: Date.now(),
      message: `Auto-sync started (checking every ${this.config.interval / 1000} seconds)`,
      data: { interval: this.config.interval }
    });

    this.notifyStatusChange();
    console.log(`🔄 Auto-sync started (interval: ${this.config.interval / 1000}s)`);
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
    this.status.nextCheck = null;
    this.saveConfiguration();

    this.emitEvent({
      type: 'stopped',
      timestamp: Date.now(),
      message: 'Auto-sync stopped',
      data: { 
        checksPerformed: this.status.checksPerformed,
        successfulSyncs: this.status.successfulSyncs,
        failedSyncs: this.status.failedSyncs
      }
    });

    this.notifyStatusChange();
    console.log('⏹️ Auto-sync stopped');
  }

  // Toggle auto-sync on/off
  toggle(): void {
    if (this.status.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  // Event system
  addEventListener(listener: (event: AutoSyncEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  private emitEvent(event: AutoSyncEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in auto-sync event listener:', error);
      }
    });
  }

  private notifyStatusChange(): void {
    if (this.config.onStatusChange) {
      try {
        this.config.onStatusChange(this.status);
      } catch (error) {
        console.error('Error in status change callback:', error);
      }
    }
  }

  // Reset statistics
  resetStats(): void {
    this.status.checksPerformed = 0;
    this.status.successfulSyncs = 0;
    this.status.failedSyncs = 0;
    this.status.lastError = null;
    this.saveConfiguration();
    this.notifyStatusChange();
  }

  // Get sync statistics
  getStats(): {
    checksPerformed: number;
    successfulSyncs: number;
    failedSyncs: number;
    successRate: number;
    lastCheck: string | null;
    lastSync: string | null;
    uptime: number | null;
  } {
    const now = Date.now();
    const uptime = this.status.isRunning && this.status.lastCheck 
      ? now - this.status.lastCheck 
      : null;

    return {
      checksPerformed: this.status.checksPerformed,
      successfulSyncs: this.status.successfulSyncs,
      failedSyncs: this.status.failedSyncs,
      successRate: this.status.checksPerformed > 0 
        ? (this.status.successfulSyncs / this.status.checksPerformed) * 100 
        : 0,
      lastCheck: this.status.lastCheck ? new Date(this.status.lastCheck).toLocaleString() : null,
      lastSync: this.status.lastSync ? new Date(this.status.lastSync).toLocaleString() : null,
      uptime: uptime
    };
  }

  // Perform a sync check (main sync logic)
  private async performSyncCheck(): Promise<void> {
    if (!this.status.isRunning) {
      return;
    }

    try {
      this.status.lastCheck = Date.now();
      this.status.checksPerformed++;
      this.status.nextCheck = Date.now() + this.config.interval;
      this.saveConfiguration();

      this.emitEvent({
        type: 'checking',
        timestamp: Date.now(),
        message: 'Checking for content updates...',
        data: { checkNumber: this.status.checksPerformed }
      });

      // Check for updates with retry logic
      const hasUpdates = await this.checkForUpdatesWithRetry();
      
      if (hasUpdates) {
        await this.performSyncWithRetry();
      } else {
        this.emitEvent({
          type: 'no-updates',
          timestamp: Date.now(),
          message: 'No updates found',
          data: { checkNumber: this.status.checksPerformed }
        });
      }

    } catch (error) {
      console.error('❌ Auto-sync check failed:', error);
      this.status.failedSyncs++;
      this.status.lastError = error.message;
      this.saveConfiguration();

      this.emitEvent({
        type: 'error',
        timestamp: Date.now(),
        message: `Sync check failed: ${error.message}`,
        data: { error: error.message, checkNumber: this.status.checksPerformed }
      });

      if (this.config.onError) {
        try {
          this.config.onError(error);
        } catch (callbackError) {
          console.error('Error in onError callback:', callbackError);
        }
      }
    }

    this.notifyStatusChange();
  }

  // Check for updates with retry logic
  private async checkForUpdatesWithRetry(): Promise<boolean> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Get the last known sync timestamp
        const lastSyncTimestamp = this.getLastKnownTimestamp();

        // Check for updates using the Google Drive downloader
        const updateCheck = await googleDriveDownloader.checkForUpdates({
          fileId: this.config.fileId,
          fileName: this.config.fileName,
          lastKnownTimestamp: lastSyncTimestamp
        });

        if (updateCheck.hasUpdates) {
          console.log(`🔄 Auto-sync: Updates detected (attempt ${attempt})`);
          return true;
        } else {
          console.log(`✅ Auto-sync: No updates (attempt ${attempt})`);
          return false;
        }

      } catch (error) {
        lastError = error;
        console.warn(`Auto-sync check attempt ${attempt} failed:`, error.message);

        if (attempt < this.config.maxRetries) {
          console.log(`Retrying in ${this.config.retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    throw lastError;
  }

  // Perform sync with retry logic
  private async performSyncWithRetry(): Promise<void> {
    let lastError: Error;

    this.emitEvent({
      type: 'syncing',
      timestamp: Date.now(),
      message: 'Downloading and applying updates...',
      data: { maxRetries: this.config.maxRetries }
    });

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Download and apply content
        const result = await googleDriveDownloader.downloadContent({
          fileId: this.config.fileId,
          fileName: this.config.fileName,
          applyToSite: true
        });

        // Update status
        this.status.lastSync = Date.now();
        this.status.successfulSyncs++;
        this.status.lastError = null;
        this.saveConfiguration();

        // Store the sync timestamp for future comparisons
        this.updateLastKnownTimestamp(result.fileInfo.modifiedTime);

        console.log(`✅ Auto-sync: Content synchronized successfully (attempt ${attempt})`);

        this.emitEvent({
          type: 'success',
          timestamp: Date.now(),
          message: `Content synchronized successfully`,
          data: { 
            attempt,
            fileName: result.fileInfo.name,
            fileModified: result.fileInfo.modifiedTime
          }
        });

        // Call success callback
        if (this.config.onUpdate) {
          try {
            this.config.onUpdate(result);
          } catch (callbackError) {
            console.error('Error in onUpdate callback:', callbackError);
          }
        }

        return; // Success!

      } catch (error) {
        lastError = error;
        console.warn(`Auto-sync attempt ${attempt} failed:`, error.message);

        if (attempt < this.config.maxRetries) {
          console.log(`Retrying sync in ${this.config.retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    // All attempts failed
    this.status.failedSyncs++;
    this.status.lastError = lastError.message;
    this.saveConfiguration();

    throw lastError;
  }

  // Get the last known timestamp for comparison
  private getLastKnownTimestamp(): number {
    try {
      const stored = localStorage.getItem('twofifths-last-sync-timestamp');
      return stored ? parseInt(stored) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Update the last known timestamp
  private updateLastKnownTimestamp(modifiedTime: string): void {
    try {
      const timestamp = new Date(modifiedTime).getTime();
      localStorage.setItem('twofifths-last-sync-timestamp', timestamp.toString());
    } catch (error) {
      console.warn('Failed to update last sync timestamp:', error);
    }
  }

  // Manual sync trigger
  async triggerManualSync(): Promise<DownloadResult> {
    if (!this.isInitialized) {
      throw new Error('AutoSyncManager not initialized');
    }

    this.emitEvent({
      type: 'syncing',
      timestamp: Date.now(),
      message: 'Manual sync triggered...',
      data: { manual: true }
    });

    try {
      const result = await this.performSyncWithRetry();
      
      this.emitEvent({
        type: 'success',
        timestamp: Date.now(),
        message: 'Manual sync completed successfully',
        data: { manual: true }
      });

      return result;
    } catch (error) {
      this.emitEvent({
        type: 'error',
        timestamp: Date.now(),
        message: `Manual sync failed: ${error.message}`,
        data: { manual: true, error: error.message }
      });
      throw error;
    }
  }

  // Force a sync check now (outside of normal interval)
  async forceCheck(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('AutoSyncManager not initialized');
    }

    console.log('🔄 Force checking for updates...');
    await this.performSyncCheck();
  }

  // Get time until next check
  getTimeUntilNextCheck(): number | null {
    if (!this.status.isRunning || !this.status.nextCheck) {
      return null;
    }
    
    const timeLeft = this.status.nextCheck - Date.now();
    return Math.max(0, timeLeft);
  }

  // Get formatted time until next check
  getFormattedTimeUntilNextCheck(): string | null {
    const timeLeft = this.getTimeUntilNextCheck();
    if (timeLeft === null) {
      return null;
    }

    const seconds = Math.ceil(timeLeft / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}

// Export singleton instance
export const autoSyncManager = AutoSyncManager.getInstance();