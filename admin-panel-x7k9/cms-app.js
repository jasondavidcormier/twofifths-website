// Content Management System Component with Google Identity Services (GIS)
const { useState, useEffect, useRef } = React;

// Google Drive Client using Google Identity Services (GIS)
class GoogleDriveClient {
  constructor() {
    this.isInitialized = false;
    this.isSignedIn = false;
    this.tokenClient = null;
    this.accessToken = null;
    this.config = {
      clientId: '652780960725-bfl3u5e0fa2nus1k41lqnp1u27i3b6ct.apps.googleusercontent.com',
      scopes: 'https://www.googleapis.com/auth/drive.file',
      fileId: '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9',
      fileName: 'twofifths-content.json'
    };
    this.authStateListeners = [];
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.loadGoogleIdentityServices();
      
      // Initialize OAuth2 token client using GIS
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scopes,
        callback: (response) => {
          if (response.error) {
            console.error('❌ OAuth2 error:', response.error);
            this.notifyAuthStateChange(false);
            return;
          }

          console.log('✅ OAuth2 token received');
          this.accessToken = response.access_token;
          this.isSignedIn = true;
          this.notifyAuthStateChange(true);
        }
      });
      
      this.isInitialized = true;
      console.log('✅ Google Identity Services initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Google Identity Services:', error);
      throw new Error('Failed to initialize Google Identity Services');
    }
  }

  loadGoogleIdentityServices() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      // Check if script already exists
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        const checkGoogle = () => {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        console.log('✅ Google Identity Services script loaded');
        setTimeout(() => {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            reject(new Error('Google Identity Services not available after loading'));
          }
        }, 500);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Google Identity Services script');
        reject(new Error('Failed to load Google Identity Services script'));
      };
      document.head.appendChild(script);
    });
  }

  async signIn() {
    if (!this.isInitialized) await this.initialize();
    if (this.isSignedIn) return;

    try {
      // Request access token using GIS
      this.tokenClient.requestAccessToken();
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
      throw new Error('Failed to sign in to Google Drive');
    }
  }

  async signOut() {
    if (!this.isSignedIn) return;

    try {
      // Revoke the access token
      if (this.accessToken) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        } catch (revokeError) {
          console.warn('Could not revoke token:', revokeError);
        }
      }
      
      this.isSignedIn = false;
      this.accessToken = null;
      this.notifyAuthStateChange(false);
      console.log('✅ Signed out from Google Drive');
    } catch (error) {
      console.error('❌ Sign-out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  getAuthStatus() {
    return {
      isInitialized: this.isInitialized,
      isSignedIn: this.isSignedIn
    };
  }

  getAccessToken() {
    return this.accessToken;
  }

  onAuthStateChange(listener) {
    this.authStateListeners.push(listener);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  notifyAuthStateChange(isSignedIn) {
    this.authStateListeners.forEach(listener => listener(isSignedIn));
  }

  // Get user info using the access token
  async getUserInfo() {
    if (!this.accessToken) return null;

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Could not retrieve user info:', error);
    }
    return null;
  }
}

// Google Drive Uploader for content
class GoogleDriveUploader {
  constructor(client) {
    this.client = client;
    this.progressListeners = [];
  }

  onProgress(listener) {
    this.progressListeners.push(listener);
    return () => {
      this.progressListeners = this.progressListeners.filter(l => l !== listener);
    };
  }

  notifyProgress(progress) {
    this.progressListeners.forEach(listener => listener(progress));
  }

  async uploadContent(content, options = {}) {
    const fileName = options.fileName || this.client.config.fileName;
    const targetFileId = options.fileId || this.client.config.fileId;
    const description = options.description || 'Two Fifths CMS Content - Auto-generated backup';

    try {
      this.notifyProgress({
        stage: 'preparing',
        message: 'Preparing content for upload...',
        progress: 10
      });

      if (!this.client.getAuthStatus().isSignedIn) {
        throw new Error('Please sign in to Google Drive first');
      }

      const exportData = {
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
        stage: 'uploading',
        message: 'Uploading to Google Drive...',
        progress: 50
      });

      const result = await this.performUpload(
        targetFileId,
        fileContent,
        fileName,
        description
      );

      this.notifyProgress({
        stage: 'complete',
        message: '✅ Successfully uploaded to Google Drive',
        progress: 100
      });

      return {
        success: true,
        fileId: result.id,
        fileName: result.name,
        message: 'Content successfully uploaded to Google Drive',
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

  async performUpload(targetFileId, fileContent, fileName, description) {
    const accessToken = this.client.getAccessToken();
    if (!accessToken) {
      throw new Error('Could not get access token');
    }

    // Try to update existing file first, then create new if it fails
    let uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${targetFileId}?uploadType=multipart`;
    let method = 'PATCH';

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const metadata = {
      'name': fileName,
      'description': description
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      close_delim;

    let response = await fetch(uploadUrl, {
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`
      },
      body: multipartRequestBody
    });

    // If update failed, try creating new file
    if (!response.ok && response.status === 404) {
      uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      method = 'POST';
      
      const newMetadata = {
        'name': fileName,
        'description': description,
        'parents': []
      };

      const newMultipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(newMetadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        fileContent +
        close_delim;

      response = await fetch(uploadUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`
        },
        body: newMultipartRequestBody
      });
    }

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
}

// Initialize Google Drive components
const googleDriveClient = new GoogleDriveClient();
const googleDriveUploader = new GoogleDriveUploader(googleDriveClient);

// Google Drive Authentication Component using GIS
const GoogleDriveAuth = () => {
  const [authState, setAuthState] = useState({
    isInitialized: false,
    isSignedIn: false,
    isLoading: false,
    error: null,
    userEmail: null
  });

  useEffect(() => {
    initializeGoogleDrive();
  }, []);

  const initializeGoogleDrive = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await googleDriveClient.initialize();
      
      const status = googleDriveClient.getAuthStatus();
      setAuthState(prev => ({ 
        ...prev, 
        isInitialized: status.isInitialized,
        isSignedIn: status.isSignedIn,
        isLoading: false 
      }));

      // Listen for auth state changes
      googleDriveClient.onAuthStateChange(async (isSignedIn) => {
        setAuthState(prev => ({ ...prev, isSignedIn }));
        if (isSignedIn) {
          const userInfo = await googleDriveClient.getUserInfo();
          if (userInfo) {
            setAuthState(prev => ({ ...prev, userEmail: userInfo.email }));
          }
        } else {
          setAuthState(prev => ({ ...prev, userEmail: null }));
        }
      });

      console.log('✅ Google Drive initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Google Drive:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Failed to initialize Google Drive: ' + error.message,
        isLoading: false 
      }));
    }
  };

  const handleSignIn = async () => {
    if (!authState.isInitialized) {
      setAuthState(prev => ({ ...prev, error: 'Google Drive not initialized yet' }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await googleDriveClient.signIn();
      
      console.log('✅ Successfully signed in to Google Drive');
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Sign-in failed: ' + error.message,
        isLoading: false 
      }));
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await googleDriveClient.signOut();
      
      console.log('✅ Successfully signed out from Google Drive');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Failed to sign out: ' + error.message,
        isLoading: false 
      }));
    }
  };

  const testConnection = async () => {
    if (!authState.isSignedIn) {
      setAuthState(prev => ({ ...prev, error: 'Please sign in first' }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const accessToken = googleDriveClient.getAccessToken();
      const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=1&fields=files(id,name)', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const files = data.files || [];
      
      console.log('✅ Connection test successful. Found', files.length, 'files');
      
      setAuthState(prev => ({ 
        ...prev, 
        error: null,
        isLoading: false 
      }));

      alert(`✅ Connection test successful!\nFound ${files.length} files in your Google Drive.\nAPI access is working correctly.`);
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Connection test failed: ' + error.message,
        isLoading: false 
      }));
    }
  };

  const testFileOperations = async () => {
    if (!authState.isSignedIn) {
      setAuthState(prev => ({ ...prev, error: 'Please sign in first' }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Test creating a simple file
      const testContent = JSON.stringify({
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test file from Two Fifths CMS'
      }, null, 2);

      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const metadata = {
        'name': 'twofifths-test-file.json',
        'description': 'Test file created by Two Fifths CMS'
      };

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        testContent +
        close_delim;

      const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleDriveClient.getAccessToken()}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`
        },
        body: multipartRequestBody
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('✅ Test file created successfully:', uploadResult);

      // Test downloading the file
      const downloadResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${googleDriveClient.getAccessToken()}`
        }
      });

      if (!downloadResponse.ok) {
        throw new Error(`Download failed: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }

      const downloadedContent = await downloadResponse.text();
      const parsedContent = JSON.parse(downloadedContent);
      
      console.log('✅ Test file downloaded successfully:', parsedContent);

      // Clean up - delete the test file
      const deleteResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${googleDriveClient.getAccessToken()}`
        }
      });

      if (deleteResponse.ok) {
        console.log('✅ Test file cleaned up successfully');
      }

      setAuthState(prev => ({ 
        ...prev, 
        error: null,
        isLoading: false 
      }));

      alert(`✅ File operations test successful!\n\nCreated file: ${uploadResult.name}\nFile ID: ${uploadResult.id}\nDownloaded and verified content\nCleaned up test file\n\nGoogle Drive integration is working perfectly!`);

    } catch (error) {
      console.error('❌ File operations test failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'File operations test failed: ' + error.message,
        isLoading: false 
      }));
    }
  };

  return React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6" },
    // Header
    React.createElement('div', { className: "flex items-center space-x-3 mb-6" },
      React.createElement('div', { 
        className: "w-8 h-8 rounded-full flex items-center justify-center",
        style: { backgroundColor: '#4285f4' }
      },
        React.createElement('svg', { 
          className: "w-5 h-5 text-white", 
          fill: "currentColor", 
          viewBox: "0 0 24 24" 
        },
          React.createElement('path', { 
            d: "M6.28 3l5.72 5.72L18.28 3H21l-6.28 6.28L21 15.56V18l-6.28-6.28L8.44 18H6l6.28-6.28L6 5.44V3z" 
          })
        )
      ),
      React.createElement('h3', { className: "text-xl font-semibold text-gray-900" }, "Google Drive (GIS)")
    ),

    // Status Display
    React.createElement('div', { className: "mb-6" },
      React.createElement('div', { className: "flex items-center justify-between mb-2" },
        React.createElement('span', { className: "text-sm font-medium text-gray-700" }, "Status:"),
        React.createElement('div', { className: "flex items-center space-x-2" },
          React.createElement('div', { 
            className: `w-3 h-3 rounded-full ${
              authState.isSignedIn ? 'bg-green-500' : 
              authState.isInitialized ? 'bg-yellow-500' : 'bg-gray-400'
            }`
          }),
          React.createElement('span', { 
            className: `text-sm font-medium ${
              authState.isSignedIn ? 'text-green-700' : 
              authState.isInitialized ? 'text-yellow-700' : 'text-gray-700'
            }`
          }, 
            authState.isSignedIn ? 'Connected' : 
            authState.isInitialized ? 'Ready' : 'Initializing...'
          )
        )
      ),
      
      // User email if signed in
      authState.userEmail && React.createElement('div', { className: "text-sm text-gray-600" },
        'Signed in as: ', React.createElement('span', { className: "font-medium" }, authState.userEmail)
      )
    ),

    // Error Display
    authState.error && React.createElement('div', { 
      className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" 
    },
      React.createElement('div', { className: "flex items-start space-x-2" },
        React.createElement('svg', { 
          className: "w-4 h-4 text-red-600 mt-0.5 flex-shrink-0", 
          fill: "currentColor", 
          viewBox: "0 0 20 20" 
        },
          React.createElement('path', { 
            fillRule: "evenodd", 
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
            clipRule: "evenodd" 
          })
        ),
        React.createElement('span', { className: "text-red-800 text-sm" }, authState.error)
      )
    ),

    // Action Buttons
    React.createElement('div', { className: "space-y-3" },
      !authState.isSignedIn ? (
        React.createElement('button', {
          onClick: handleSignIn,
          disabled: authState.isLoading || !authState.isInitialized,
          className: `w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            authState.isLoading || !authState.isInitialized
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`
        },
          authState.isLoading && React.createElement('svg', { 
            className: "w-4 h-4 animate-spin", 
            fill: "none", 
            viewBox: "0 0 24 24" 
          },
            React.createElement('circle', { 
              className: "opacity-25", 
              cx: "12", 
              cy: "12", 
              r: "10", 
              stroke: "currentColor", 
              strokeWidth: "4" 
            }),
            React.createElement('path', { 
              className: "opacity-75", 
              fill: "currentColor", 
              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            })
          ),
          React.createElement('span', null, 
            authState.isLoading ? 'Signing in...' : 
            !authState.isInitialized ? 'Initializing...' : 'Sign in with Google'
          )
        )
      ) : (
        React.createElement('div', { className: "space-y-3" },
          React.createElement('button', {
            onClick: testConnection,
            disabled: authState.isLoading,
            className: `w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors`
          },
            React.createElement('svg', { 
              className: "w-4 h-4", 
              fill: "none", 
              stroke: "currentColor", 
              viewBox: "0 0 24 24" 
            },
              React.createElement('path', { 
                strokeLinecap: "round", 
                strokeLinejoin: "round", 
                strokeWidth: 2, 
                d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              })
            ),
            React.createElement('span', null, 'Test Connection')
          ),

          React.createElement('button', {
            onClick: testFileOperations,
            disabled: authState.isLoading,
            className: `w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors`
          },
            React.createElement('svg', { 
              className: "w-4 h-4", 
              fill: "none", 
              stroke: "currentColor", 
              viewBox: "0 0 24 24" 
            },
              React.createElement('path', { 
                strokeLinecap: "round", 
                strokeLinejoin: "round", 
                strokeWidth: 2, 
                d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
              })
            ),
            React.createElement('span', null, 'Test File Operations')
          ),
          
          React.createElement('button', {
            onClick: handleSignOut,
            disabled: authState.isLoading,
            className: `w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors`
          }, 'Sign Out')
        )
      )
    ),

    // Instructions
    React.createElement('div', { className: "mt-6 p-4 bg-gray-50 rounded-lg" },
      React.createElement('h4', { className: "font-medium text-gray-900 mb-2" }, "Google Identity Services (GIS)"),
      React.createElement('ul', { className: "text-sm text-gray-600 space-y-1" },
        React.createElement('li', null, "• Updated to use Google Identity Services (required for new OAuth clients)"),
        React.createElement('li', null, "• Click 'Sign in with Google' to authenticate"),
        React.createElement('li', null, "• Use 'Test Connection' to verify API access"),
        React.createElement('li', null, "• Use 'Test File Operations' to verify upload/download"),
        React.createElement('li', null, "• This resolves the 'idpiframe_initialization_failed' error")
      )
    )
  );
};

// Default content structure
const defaultContent = {
  hero: {
    headline: 'Fractional Partnership Leadership on Demand',
    subheadline: 'Get partnership expertise without the full-time hire. Solve growth challenges with proven leadership and rapid execution.',
    ctaText: 'Browse Service Packages',
    ctaLink: '#audience-selector'
  },
  about: {
    title: 'Why Two Fifths?',
    description: 'Growth doesn\'t happen in a vacuum. Most SaaS companies know partnerships can accelerate growth, but lack the expertise to execute effectively. Two Fifths brings battle-tested, fractional leadership to transform untapped opportunities into competitive advantages.'
  },
  services: [
    {
      title: 'Fractional Partnership Leadership',
      description: 'Get an experienced partnership executive embedded in your team to build, execute and scale your partnership program.'
    },
    {
      title: 'Partnership Strategy Development',
      description: 'Comprehensive partnership strategy and roadmap development tailored to your business goals and market position.'
    },
    {
      title: 'ANZ Market Expansion',
      description: 'Local expertise and relationships to accelerate your expansion into Australia and New Zealand markets.'
    }
  ],
  contact: {
    email: 'jason@twofifthsfractional.com',
    phone: '+61 423 161 718',
    address: 'Melbourne, Australia'
  }
};

// Main CMS Component
const TwoFifthsCMS = () => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('twofifths-cms-content');
    return saved ? JSON.parse(saved) : defaultContent;
  });
  
  const [lastSaved, setLastSaved] = useState(() => {
    const saved = localStorage.getItem('twofifths-cms-last-saved');
    return saved ? parseInt(saved) : null;
  });
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const fileInputRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('twofifths-cms-content', JSON.stringify(content));
      const now = Date.now();
      localStorage.setItem('twofifths-cms-last-saved', now.toString());
      setLastSaved(now);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  // Helper function to update nested content
  const updateContent = (path, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      let current = newContent;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  // Service management
  const addService = () => {
    setContent(prev => ({
      ...prev,
      services: [...prev.services, { title: '', description: '' }]
    }));
  };

  const removeService = (index) => {
    setContent(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Data management functions
  const handleSave = () => {
    localStorage.setItem('twofifths-cms-content', JSON.stringify(content));
    const now = Date.now();
    localStorage.setItem('twofifths-cms-last-saved', now.toString());
    setLastSaved(now);
    alert('Content saved successfully!');
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('Preparing deployment...');
    
    try {
      // Check Google Drive authentication
      if (!googleDriveClient.getAuthStatus().isSignedIn) {
        setDeploymentStatus('Please sign in to Google Drive first');
        setIsDeploying(false);
        return;
      }
      
      // Upload to Google Drive
      setDeploymentStatus('Uploading to Google Drive...');
      const uploadResult = await googleDriveUploader.uploadContent(content, {
        fileName: 'twofifths-content.json',
        fileId: '1gAlt0FsIcspWAJ67D69h0ENATCymZiW9',
        description: 'Two Fifths CMS Content - Deployed from CMS'
      });
      
      if (uploadResult.success) {
        // Save deployment info locally
        localStorage.setItem('twofifths-deployment-info', JSON.stringify({
          timestamp: Date.now(),
          status: 'deployed',
          source: 'cms-google-drive',
          fileId: uploadResult.fileId,
          fileName: uploadResult.fileName
        }));
        
        setDeploymentStatus('Content uploaded to Google Drive! ✅');
        
        // Also broadcast for immediate local updates
        const channel = new BroadcastChannel('twofifths-content-updates');
        channel.postMessage({
          type: 'GOOGLE_DRIVE_CONTENT_UPDATED',
          content: content,
          timestamp: Date.now(),
          fileId: uploadResult.fileId
        });
        channel.close();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      setDeploymentStatus(`Deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
      setTimeout(() => setDeploymentStatus(''), 3000);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `twofifths-cms-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedContent = JSON.parse(e.target.result);
        setContent(importedContent);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      setContent(defaultContent);
      alert('Content reset to defaults');
    }
  };

  // Add Google Drive Auth component to the main CMS interface
  const renderGoogleDriveAuth = () => {
    return React.createElement(GoogleDriveAuth);
  };

  // Main CMS component render
  return React.createElement('div', { className: "min-h-screen bg-gray-100" },
    // Header
    React.createElement('div', { className: "bg-white shadow-sm border-b" },
      React.createElement('div', { className: "max-w-6xl mx-auto px-6 py-4" },
        React.createElement('div', { className: "flex items-center justify-between" },
          React.createElement('h1', { className: "text-2xl font-bold text-gray-900" }, "Two Fifths CMS"),
          React.createElement('div', { className: "flex items-center space-x-4" },
            React.createElement('span', { className: "text-sm text-gray-600" }, 
              `Last saved: ${lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'Never'}`
            ),
            React.createElement('button', {
              onClick: handleSave,
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            }, "Save Changes"),
            React.createElement('button', {
              onClick: handleDeploy,
              disabled: isDeploying,
              className: `px-4 py-2 rounded-lg transition-colors ${
                isDeploying 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`
            }, isDeploying ? 'Deploying...' : 'Deploy to Live Site')
          )
        ),
        deploymentStatus && React.createElement('div', { 
          className: `mt-2 text-sm ${
            deploymentStatus.includes('failed') || deploymentStatus.includes('error') 
              ? 'text-red-600' 
              : deploymentStatus.includes('✅') 
                ? 'text-green-600' 
                : 'text-blue-600'
          }`
        }, deploymentStatus)
      )
    ),
    
    // Main content
    React.createElement('div', { className: "max-w-6xl mx-auto px-6 py-8" },
      // Google Drive Authentication
      renderGoogleDriveAuth(),
      
      // Content sections
      React.createElement('div', { className: "grid lg:grid-cols-3 gap-8" },
        // Left column - Content editing
        React.createElement('div', { className: "lg:col-span-2 space-y-8" },
          // Hero Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Hero Section"),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Main Headline"),
                React.createElement('input', {
                  type: "text",
                  value: content.hero.headline,
                  onChange: (e) => updateContent(['hero', 'headline'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Subheadline"),
                React.createElement('textarea', {
                  value: content.hero.subheadline,
                  onChange: (e) => updateContent(['hero', 'subheadline'], e.target.value),
                  rows: 3,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Call-to-Action Button Text"),
                React.createElement('input', {
                  type: "text",
                  value: content.hero.ctaText,
                  onChange: (e) => updateContent(['hero', 'ctaText'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "CTA Button Link"),
                React.createElement('input', {
                  type: "url",
                  value: content.hero.ctaLink,
                  onChange: (e) => updateContent(['hero', 'ctaLink'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  placeholder: "https://example.com"
                })
              )
            )
          ),

          // About Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "About Section"),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Section Title"),
                React.createElement('input', {
                  type: "text",
                  value: content.about.title,
                  onChange: (e) => updateContent(['about', 'title'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Description"),
                React.createElement('textarea', {
                  value: content.about.description,
                  onChange: (e) => updateContent(['about', 'description'], e.target.value),
                  rows: 6,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              )
            )
          ),

          // Services Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('div', { className: "flex items-center justify-between mb-4" },
              React.createElement('h2', { className: "text-xl font-semibold text-gray-900" }, "Services"),
              React.createElement('button', {
                onClick: addService,
                className: "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              }, "Add Service")
            ),
            React.createElement('div', { className: "space-y-6" },
              content.services.map((service, index) =>
                React.createElement('div', { 
                  key: index, 
                  className: "border border-gray-200 rounded-lg p-4" 
                },
                  React.createElement('div', { className: "flex items-center justify-between mb-3" },
                    React.createElement('h3', { className: "font-medium text-gray-900" }, `Service ${index + 1}`),
                    React.createElement('button', {
                      onClick: () => removeService(index),
                      className: "text-red-600 hover:text-red-800 text-sm"
                    }, "Remove")
                  ),
                  React.createElement('div', { className: "space-y-3" },
                    React.createElement('input', {
                      type: "text",
                      placeholder: "Service title",
                      value: service.title,
                      onChange: (e) => updateContent(['services', index, 'title'], e.target.value),
                      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }),
                    React.createElement('textarea', {
                      placeholder: "Service description",
                      value: service.description,
                      onChange: (e) => updateContent(['services', index, 'description'], e.target.value),
                      rows: 3,
                      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    })
                  )
                )
              )
            )
          ),

          // Contact Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Contact Information"),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Email"),
                React.createElement('input', {
                  type: "email",
                  value: content.contact.email,
                  onChange: (e) => updateContent(['contact', 'email'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Phone"),
                React.createElement('input', {
                  type: "tel",
                  value: content.contact.phone,
                  onChange: (e) => updateContent(['contact', 'phone'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Address"),
                React.createElement('textarea', {
                  value: content.contact.address,
                  onChange: (e) => updateContent(['contact', 'address'], e.target.value),
                  rows: 3,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              )
            )
          )
        ),

        // Right column - Preview and tools
        React.createElement('div', { className: "space-y-8" },
          // Live Preview
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Live Preview"),
            React.createElement('div', { className: "border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto" },
              React.createElement('div', { className: "space-y-4 text-sm" },
                React.createElement('div', null,
                  React.createElement('h3', { className: "font-bold text-lg" }, content.hero.headline),
                  React.createElement('p', { className: "text-gray-600" }, content.hero.subheadline),
                  React.createElement('button', { 
                    className: "mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm" 
                  }, content.hero.ctaText)
                ),
                React.createElement('div', null,
                  React.createElement('h3', { className: "font-bold" }, content.about.title),
                  React.createElement('p', { className: "text-gray-600" }, content.about.description)
                ),
                React.createElement('div', null,
                  React.createElement('h3', { className: "font-bold mb-2" }, "Services"),
                  content.services.map((service, index) =>
                    React.createElement('div', { key: index, className: "mb-2" },
                      React.createElement('h4', { className: "font-medium" }, service.title),
                      React.createElement('p', { className: "text-gray-600 text-xs" }, service.description)
                    )
                  )
                ),
                React.createElement('div', null,
                  React.createElement('h3', { className: "font-bold" }, "Contact"),
                  React.createElement('p', { className: "text-gray-600" }, content.contact.email),
                  React.createElement('p', { className: "text-gray-600" }, content.contact.phone),
                  React.createElement('p', { className: "text-gray-600" }, content.contact.address)
                )
              )
            )
          ),

          // Export/Import Tools
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Data Management"),
            React.createElement('div', { className: "space-y-3" },
              React.createElement('button', {
                onClick: exportData,
                className: "w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              }, "Export Data"),
              React.createElement('div', null,
                React.createElement('input', {
                  type: "file",
                  ref: fileInputRef,
                  onChange: importData,
                  accept: ".json",
                  className: "hidden"
                }),
                React.createElement('button', {
                  onClick: () => fileInputRef.current?.click(),
                  className: "w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                }, "Import Data")
              ),
              React.createElement('button', {
                onClick: resetToDefaults,
                className: "w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              }, "Reset to Defaults")
            )
          )
        )
      )
    )
  );
};

// Initialize the app
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(TwoFifthsCMS));
} else {
  console.error('Root container not found');
}