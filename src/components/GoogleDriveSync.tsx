import React, { useState, useEffect } from 'react';
import { Cloud, Download, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface GoogleDriveSyncProps {
  onContentUpdate?: (content: any) => void;
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const GoogleDriveSync: React.FC<GoogleDriveSyncProps> = ({ onContentUpdate }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [gapiLoaded, setGapiLoaded] = useState(false);

  // Google API Configuration
  const CLIENT_ID = '652780960725-bfl3u5e0fa2nus1k41lqnp1u27i3b6ct.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyAan9fk4Xe6U4BPWRIaA9Y5gTrWh2DShPk';
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/drive.file';
  
  // Target Google Drive file configuration
  const TARGET_FILE_ID = '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9';
  const TARGET_FILE_NAME = 'twofifths-content.json';

  // Initialize Google API
  useEffect(() => {
    const initializeGapi = async () => {
      try {
        // Load Google API script if not already loaded
        if (!window.gapi) {
          await loadGoogleAPI();
        }

        // Initialize gapi
        await new Promise<void>((resolve, reject) => {
          window.gapi.load('client:auth2', async () => {
            try {
              await window.gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOC],
                scope: SCOPES
              });

              const authInstance = window.gapi.auth2.getAuthInstance();
              setIsSignedIn(authInstance.isSignedIn.get());
              
              // Listen for sign-in state changes
              authInstance.isSignedIn.listen(setIsSignedIn);
              
              setGapiLoaded(true);
              setStatus('Google Drive API initialized');
              resolve();
            } catch (error) {
              console.error('Error initializing Google API:', error);
              setError('Failed to initialize Google Drive API');
              reject(error);
            }
          });
        });
      } catch (error) {
        console.error('Error loading Google API:', error);
        setError('Failed to load Google Drive API');
      }
    };

    initializeGapi();
  }, []);

  // Load Google API script dynamically
  const loadGoogleAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="apis.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  };

  // Sign in to Google
  const handleSignIn = async () => {
    if (!gapiLoaded) {
      setError('Google API not loaded yet');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setStatus('Signing in to Google...');

      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      
      setStatus('Successfully signed in to Google Drive');
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Failed to sign in to Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out from Google
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setStatus('Signed out from Google Drive');
    } catch (error) {
      console.error('Sign-out error:', error);
      setError('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Get OAuth2 access token
  const getAccessToken = (): string | null => {
    if (!isSignedIn) return null;
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    return user.getAuthResponse().access_token;
  };

  // Upload content to Google Drive
  const uploadToGoogleDrive = async (content: any, filename: string = TARGET_FILE_NAME) => {
    if (!isSignedIn) {
      setError('Please sign in to Google Drive first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setStatus('Uploading to Google Drive...');

      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Prepare the content
      const exportData = {
        type: 'twofifths-cms-export',
        version: '1.0.0',
        timestamp: Date.now(),
        content: content,
        metadata: {
          exportedBy: 'Two Fifths CMS',
          exportedAt: new Date().toISOString(),
          source: 'google-drive-sync'
        }
      };

      const fileContent = JSON.stringify(exportData, null, 2);
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const metadata = {
        'name': filename,
        'parents': [], // Will be saved to root folder
        'description': 'Two Fifths CMS Content - Auto-generated backup'
      };

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        fileContent +
        close_delim;

      // Check if target file exists and update it, otherwise create new
      let uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      let method = 'POST';
      
      try {
        // Try to update the existing file
        const existingFileCheck = await fetch(
          `https://www.googleapis.com/drive/v3/files/${TARGET_FILE_ID}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (existingFileCheck.ok) {
          // File exists, update it
          uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${TARGET_FILE_ID}?uploadType=multipart`;
          method = 'PATCH';
          setStatus('Updating existing file in Google Drive...');
        } else {
          setStatus('Creating new file in Google Drive...');
        }
      } catch (checkError) {
        console.log('Could not check existing file, creating new one');
        setStatus('Creating new file in Google Drive...');
      }
      
      const request = await fetch(uploadUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`
        },
        body: multipartRequestBody
      });

      if (!request.ok) {
        const errorData = await request.json();
        throw new Error(`Upload failed: ${errorData.error?.message || request.statusText}`);
      }

      const result = await request.json();
      setStatus(`✅ Successfully ${method === 'PATCH' ? 'updated' : 'uploaded'} to Google Drive: ${result.name}`);
      
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Download content from Google Drive
  const downloadFromGoogleDrive = async (fileId: string = TARGET_FILE_ID, filename: string = TARGET_FILE_NAME) => {
    if (!isSignedIn) {
      setError('Please sign in to Google Drive first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setStatus('Searching for content file...');

      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      let file;
      
      // First try to get the specific file by ID
      try {
        const directResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,modifiedTime`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (directResponse.ok) {
          file = await directResponse.json();
          setStatus(`Found target file: ${file.name} (modified: ${new Date(file.modifiedTime).toLocaleString()})`);
        } else {
          throw new Error('Target file not found by ID');
        }
      } catch (directError) {
        console.log('Direct file access failed, searching by name...');
        
        // Fallback: Search for the file by name
        const searchResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${filename}'&fields=files(id,name,modifiedTime)`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!searchResponse.ok) {
          throw new Error(`Search failed: ${searchResponse.statusText}`);
        }

        const searchResult = await searchResponse.json();
        
        if (!searchResult.files || searchResult.files.length === 0) {
          throw new Error(`File '${filename}' not found in Google Drive`);
        }
        
        // Get the most recent file
        file = searchResult.files[0];
        setStatus(`Found file by search: ${file.name} (modified: ${new Date(file.modifiedTime).toLocaleString()})`);
      }

      // Download the file content
      const downloadResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!downloadResponse.ok) {
        throw new Error(`Download failed: ${downloadResponse.statusText}`);
      }

      const fileContent = await downloadResponse.text();
      const parsedContent = JSON.parse(fileContent);

      // Validate the content
      if (parsedContent.type === 'twofifths-cms-export' && parsedContent.content) {
        setStatus(`✅ Successfully downloaded content from Google Drive`);
        
        // Trigger content update
        if (onContentUpdate) {
          onContentUpdate(parsedContent.content);
        }
        
        return parsedContent.content;
      } else {
        throw new Error('Invalid file format');
      }

    } catch (error) {
      console.error('Download error:', error);
      setError(`Download failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Cloud className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Google Drive Sync</h3>
      </div>

      {/* Status Messages */}
      {status && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 text-sm">{status}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Authentication Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isSignedIn ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isSignedIn ? 'Connected to Google Drive' : 'Not connected'}
            </span>
          </div>
          
          {!isSignedIn ? (
            <button
              onClick={handleSignIn}
              disabled={isLoading || !gapiLoaded}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span>Sign in with Google</span>
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Sync Actions */}
      {isSignedIn && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              // Get current content from localStorage
              const currentContent = localStorage.getItem('twofifths-content');
              if (currentContent) {
                uploadToGoogleDrive(JSON.parse(currentContent));
              } else {
                setError('No content found to upload');
              }
            }}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload to Drive</span>
          </button>

          <button
            onClick={() => downloadFromGoogleDrive()}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download from Drive</span>
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Upload:</strong> Saves your current CMS content to Google Drive</li>
          <li>• <strong>Download:</strong> Loads content from Google Drive and applies it to the CMS</li>
          <li>• Files are saved as JSON format for easy backup and sharing</li>
          <li>• You can access your files from any device where you're logged into Google</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleDriveSync;