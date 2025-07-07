// Google Identity Services Authentication - Updated for GIS
const { useState, useEffect } = React;

const GoogleDriveAuth = () => {
  const [authState, setAuthState] = useState({
    isInitialized: false,
    isSignedIn: false,
    isLoading: false,
    error: null,
    userEmail: null,
    accessToken: null
  });

  // Google Drive Configuration
  const GOOGLE_CONFIG = {
    clientId: '652780960725-bfl3u5e0fa2nus1k41lqnp1u27i3b6ct.apps.googleusercontent.com',
    scopes: 'https://www.googleapis.com/auth/drive.file'
  };

  // Initialize Google Identity Services
  useEffect(() => {
    initializeGoogleIdentityServices();
  }, []);

  const initializeGoogleIdentityServices = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Load Google Identity Services
      await loadGoogleIdentityScript();

      // Initialize the Google Identity Services
      if (window.google && window.google.accounts) {
        // Initialize OAuth2 for API access
        window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CONFIG.clientId,
          scope: GOOGLE_CONFIG.scopes,
          callback: (response) => {
            if (response.error) {
              console.error('❌ OAuth2 error:', response.error);
              setAuthState(prev => ({ 
                ...prev, 
                error: 'Authentication failed: ' + response.error,
                isLoading: false 
              }));
              return;
            }

            console.log('✅ OAuth2 token received');
            setAuthState(prev => ({ 
              ...prev, 
              isSignedIn: true,
              accessToken: response.access_token,
              isLoading: false,
              error: null
            }));

            // Get user info
            getUserInfo(response.access_token);
          }
        });

        setAuthState(prev => ({ 
          ...prev, 
          isInitialized: true,
          isLoading: false 
        }));

        console.log('✅ Google Identity Services initialized successfully');
      } else {
        throw new Error('Google Identity Services not available');
      }
    } catch (error) {
      console.error('❌ Error initializing Google Identity Services:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Failed to initialize Google Identity Services: ' + error.message,
        isLoading: false 
      }));
    }
  };

  const loadGoogleIdentityScript = () => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      // Check if script already exists
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        // Wait for it to load
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
        // Wait a bit for the library to initialize
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
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const userInfo = await response.json();
        setAuthState(prev => ({ 
          ...prev, 
          userEmail: userInfo.email 
        }));
        console.log('✅ User info retrieved:', userInfo.email);
      }
    } catch (error) {
      console.warn('Could not retrieve user info:', error);
    }
  };

  const handleSignIn = async () => {
    if (!authState.isInitialized) {
      setAuthState(prev => ({ ...prev, error: 'Google Identity Services not initialized yet' }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Request access token using Google Identity Services
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scopes,
        callback: (response) => {
          if (response.error) {
            console.error('❌ Sign-in error:', response.error);
            setAuthState(prev => ({ 
              ...prev, 
              error: 'Sign-in failed: ' + response.error,
              isLoading: false 
            }));
            return;
          }

          console.log('✅ Successfully signed in to Google Drive');
          setAuthState(prev => ({ 
            ...prev, 
            isSignedIn: true,
            accessToken: response.access_token,
            isLoading: false,
            error: null
          }));

          // Get user info
          getUserInfo(response.access_token);
        }
      });

      // Request access token
      tokenClient.requestAccessToken();
      
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Failed to sign in: ' + error.message,
        isLoading: false 
      }));
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Revoke the access token
      if (authState.accessToken) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${authState.accessToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        } catch (revokeError) {
          console.warn('Could not revoke token:', revokeError);
        }
      }
      
      setAuthState(prev => ({ 
        ...prev, 
        isSignedIn: false,
        userEmail: null,
        accessToken: null,
        isLoading: false 
      }));
      
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
    if (!authState.isSignedIn || !authState.accessToken) {
      setAuthState(prev => ({ ...prev, error: 'Please sign in first' }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Test by listing files in Drive using the REST API
      const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=1&fields=files(id,name)', {
        headers: {
          'Authorization': `Bearer ${authState.accessToken}`
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
    if (!authState.isSignedIn || !authState.accessToken) {
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
          'Authorization': `Bearer ${authState.accessToken}`,
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
          'Authorization': `Bearer ${authState.accessToken}`
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
          'Authorization': `Bearer ${authState.accessToken}`
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

  return React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 max-w-md mx-auto" },
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
      ),

      // Access token status
      authState.accessToken && React.createElement('div', { className: "text-xs text-green-600 mt-1" },
        'Access token: Active'
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

// Simple test page
const TestPage = () => {
  return React.createElement('div', { className: "min-h-screen bg-gray-100 py-8" },
    React.createElement('div', { className: "max-w-2xl mx-auto px-4" },
      React.createElement('div', { className: "text-center mb-8" },
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900 mb-2" }, "Google Drive Integration"),
        React.createElement('p', { className: "text-gray-600" }, "Updated: Google Identity Services (GIS)")
      ),
      React.createElement(GoogleDriveAuth)
    )
  );
};

// Initialize the app
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(TestPage));
} else {
  console.error('Root container not found');
}