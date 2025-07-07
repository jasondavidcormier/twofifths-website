// Content Management System Component with GitHub Integration
const { useState, useEffect, useRef } = React;

// GitHub API Client
class GitHubClient {
  constructor() {
    this.isAuthenticated = false;
    this.accessToken = null;
    this.config = {
      owner: 'YOUR_GITHUB_USERNAME', // You'll need to update this
      repo: 'twofifths-website',
      branch: 'main',
      contentPath: 'src/utils/contentManager.ts'
    };
  }

  // Authenticate with GitHub using Personal Access Token
  authenticate(token) {
    this.accessToken = token;
    this.isAuthenticated = true;
    localStorage.setItem('github-token', token);
    console.log('✅ GitHub authentication successful');
  }

  // Load saved token
  loadSavedToken() {
    const saved = localStorage.getItem('github-token');
    if (saved) {
      this.accessToken = saved;
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  // Sign out
  signOut() {
    this.isAuthenticated = false;
    this.accessToken = null;
    localStorage.removeItem('github-token');
    console.log('✅ Signed out from GitHub');
  }

  // Get current file content
  async getFileContent() {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated with GitHub');
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.contentPath}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: atob(data.content), // Decode base64
        sha: data.sha // Needed for updates
      };
    } catch (error) {
      console.error('❌ Failed to get file content:', error);
      throw error;
    }
  }

  // Update file content
  async updateFileContent(newContent, commitMessage = 'Update content from CMS') {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated with GitHub');
    }

    try {
      // First get current file to get SHA
      const currentFile = await this.getFileContent();
      
      // Update the content
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.contentPath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: commitMessage,
            content: btoa(newContent), // Encode to base64
            sha: currentFile.sha,
            branch: this.config.branch
          })
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ File updated successfully:', result.commit.sha);
      return result;
    } catch (error) {
      console.error('❌ Failed to update file:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated with GitHub');
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const repo = await response.json();
      console.log('✅ GitHub connection successful:', repo.full_name);
      return repo;
    } catch (error) {
      console.error('❌ GitHub connection failed:', error);
      throw error;
    }
  }
}

// Initialize GitHub client
const githubClient = new GitHubClient();

// GitHub Authentication Component
const GitHubAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    repoInfo: null
  });
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    // Check for saved token
    const hasToken = githubClient.loadSavedToken();
    if (hasToken) {
      setAuthState(prev => ({ ...prev, isAuthenticated: true }));
      testConnection();
    }
  }, []);

  const handleSignIn = async () => {
    if (!tokenInput.trim()) {
      setAuthState(prev => ({ ...prev, error: 'Please enter a GitHub token' }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      githubClient.authenticate(tokenInput.trim());
      const repoInfo = await githubClient.testConnection();
      
      setAuthState(prev => ({ 
        ...prev, 
        isAuthenticated: true,
        isLoading: false,
        repoInfo
      }));
      setTokenInput(''); // Clear token from UI
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error.message,
        isLoading: false 
      }));
      githubClient.signOut();
    }
  };

  const handleSignOut = () => {
    githubClient.signOut();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      repoInfo: null
    });
  };

  const testConnection = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const repoInfo = await githubClient.testConnection();
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        repoInfo
      }));
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error.message,
        isLoading: false 
      }));
    }
  };

  return React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6" },
    // Header
    React.createElement('div', { className: "flex items-center space-x-3 mb-6" },
      React.createElement('div', { 
        className: "w-8 h-8 rounded-full flex items-center justify-center bg-gray-900"
      },
        React.createElement('svg', { 
          className: "w-5 h-5 text-white", 
          fill: "currentColor", 
          viewBox: "0 0 24 24" 
        },
          React.createElement('path', { 
            d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" 
          })
        )
      ),
      React.createElement('h3', { className: "text-xl font-semibold text-gray-900" }, "GitHub Integration")
    ),

    // Status Display
    React.createElement('div', { className: "mb-6" },
      React.createElement('div', { className: "flex items-center justify-between mb-2" },
        React.createElement('span', { className: "text-sm font-medium text-gray-700" }, "Status:"),
        React.createElement('div', { className: "flex items-center space-x-2" },
          React.createElement('div', { 
            className: `w-3 h-3 rounded-full ${
              authState.isAuthenticated ? 'bg-green-500' : 'bg-gray-400'
            }`
          }),
          React.createElement('span', { 
            className: `text-sm font-medium ${
              authState.isAuthenticated ? 'text-green-700' : 'text-gray-700'
            }`
          }, authState.isAuthenticated ? 'Connected' : 'Not Connected')
        )
      ),
      
      // Repository info if connected
      authState.repoInfo && React.createElement('div', { className: "text-sm text-gray-600" },
        'Repository: ', React.createElement('span', { className: "font-medium" }, authState.repoInfo.full_name)
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

    // Authentication Form or Actions
    !authState.isAuthenticated ? (
      React.createElement('div', { className: "space-y-4" },
        React.createElement('div', null,
          React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 
            "GitHub Personal Access Token"
          ),
          React.createElement('input', {
            type: "password",
            value: tokenInput,
            onChange: (e) => setTokenInput(e.target.value),
            placeholder: "ghp_xxxxxxxxxxxxxxxxxxxx",
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          })
        ),
        React.createElement('button', {
          onClick: handleSignIn,
          disabled: authState.isLoading || !tokenInput.trim(),
          className: `w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            authState.isLoading || !tokenInput.trim()
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
          React.createElement('span', null, authState.isLoading ? 'Connecting...' : 'Connect to GitHub')
        )
      )
    ) : (
      React.createElement('div', { className: "space-y-3" },
        React.createElement('button', {
          onClick: testConnection,
          disabled: authState.isLoading,
          className: "w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
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
          onClick: handleSignOut,
          disabled: authState.isLoading,
          className: "w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        }, 'Sign Out')
      )
    ),

    // Instructions
    React.createElement('div', { className: "mt-6 p-4 bg-gray-50 rounded-lg" },
      React.createElement('h4', { className: "font-medium text-gray-900 mb-2" }, "Setup Instructions"),
      React.createElement('ol', { className: "text-sm text-gray-600 space-y-1 list-decimal list-inside" },
        React.createElement('li', null, "Go to GitHub.com → Settings → Developer settings → Personal access tokens"),
        React.createElement('li', null, "Generate new token with 'repo' permissions"),
        React.createElement('li', null, "Copy the token and paste it above"),
        React.createElement('li', null, "Update the repository name in the code if different")
      )
    )
  );
};

// Rest of the CMS code would go here...
// (I'll provide the complete version in the next step)

// Initialize the app
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(GitHubAuth));
} else {
  console.error('Root container not found');
}