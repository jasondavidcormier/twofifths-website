import { useState, useEffect } from 'react';
import { contentManager, ContentData } from '../utils/contentManager';
import { googleDriveAutoSync } from '../utils/googleDriveAutoSync';

export const useContent = () => {
  const [content, setContent] = useState<ContentData>(contentManager.getContent());

  useEffect(() => {
    // Clear any cached content on mount to ensure fresh start
    localStorage.removeItem('twofifths-live-content');
    localStorage.removeItem('twofifths-deployment-info');
    
    // Check for updates from CMS on mount
    contentManager.checkForUpdates();
    
    // Initialize Google Drive auto-sync
    const initializeGoogleDriveSync = async () => {
      try {
        await googleDriveAutoSync.initialize();
        const status = googleDriveAutoSync.getStatus();
        if (status.lastError && status.lastError.includes('Origin not authorized')) {
          console.log('🔐 Google Drive auto-sync disabled due to authorization issues');
        } else {
          googleDriveAutoSync.start();
          console.log('✅ Google Drive auto-sync started');
        }
      } catch (error) {
        console.warn('⚠️ Google Drive auto-sync failed to start:', error);
      }
    };
    
    // Start Google Drive sync after a short delay
    setTimeout(initializeGoogleDriveSync, 3000);
    
    const unsubscribe = contentManager.subscribe(setContent);
    
    // Listen for content updates via BroadcastChannel
    const channel = new BroadcastChannel('twofifths-content-updates');
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CONTENT_UPDATED' ||
          event.data.type === 'GOOGLE_DRIVE_CONTENT_UPDATED' ||
          event.data.type === 'NETLIFY_CONTENT_UPDATED' ||
          event.data.type === 'NETLIFY_DEPLOYMENT_COMPLETE') {
        contentManager.updateContent(event.data.content);
        console.log('✅ Content updated via BroadcastChannel:', event.data.type);
        
        // Store Google Drive updates for persistence
        if (event.data.type === 'GOOGLE_DRIVE_CONTENT_UPDATED') {
          localStorage.setItem('twofifths-last-google-drive-update', JSON.stringify({
            content: event.data.content,
            timestamp: event.data.timestamp || Date.now(),
            source: 'google-drive',
            processed: false
          }));
        }
      }
    };
    
    channel.addEventListener('message', handleMessage);
    
    // Also listen for postMessage from CMS iframe
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data.type === 'CONTENT_UPDATED' ||
          event.data.type === 'GOOGLE_DRIVE_CONTENT_UPDATED' ||
          event.data.type === 'NETLIFY_CONTENT_UPDATED' ||
          event.data.type === 'NETLIFY_DEPLOYMENT_COMPLETE') {
        contentManager.updateContent(event.data.content);
        console.log('✅ Content updated via postMessage:', event.data.type);
        
        // Store Google Drive updates for persistence
        if (event.data.type === 'GOOGLE_DRIVE_CONTENT_UPDATED') {
          localStorage.setItem('twofifths-last-google-drive-update', JSON.stringify({
            content: event.data.content,
            timestamp: event.data.timestamp || Date.now(),
            source: 'google-drive',
            processed: false
          }));
        }
      }
    };
    
    window.addEventListener('message', handlePostMessage);
    
    // Listen for storage events (when localStorage is updated from another tab/window)
    const handleStorageChange = (event: StorageEvent) => {
      const contentKeys = [
        'twofifths-live-content',
        'twofifths-google-drive-content',
        'twofifths-last-google-drive-update',
        'twofifths-netlify-content',
        'twofifths-pending-deployment',
        'TWOFIFTHS_CMS_CONTENT',
        'TWOFIFTHS_CONTENT_TIMESTAMP'
      ];
      
      if (contentKeys.includes(event.key) && event.newValue) {
        try {
          // Trigger a content check instead of direct update
          contentManager.checkForUpdates();
          console.log('✅ Content check triggered by storage event:', event.key);
        } catch (error) {
          console.warn('Failed to parse updated content:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Periodic check for updates (every 10 seconds)
    const interval = setInterval(() => {
      contentManager.checkForUpdates();
    }, 10000); // Check every 10 seconds for all updates including Google Drive
    
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      window.removeEventListener('message', handlePostMessage);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      googleDriveAutoSync.stop();
      unsubscribe();
    };
  }, []);

  return content;
};