// Simplified Content Management System with GitHub Integration
const { useState, useEffect, useRef } = React;

// GitHub API Client for direct repository updates
class GitHubClient {
  constructor() {
    this.isAuthenticated = false;
    this.accessToken = null;
    this.config = {
      owner: 'jasondavidcormier', // Your GitHub username
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

  // Update file content with new defaultContent
  async updateContentManager(newContent, commitMessage = 'Update content from CMS') {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated with GitHub');
    }

    try {
      // First get current file to get SHA
      const currentFile = await this.getFileContent();
      
      // Replace the defaultContent in the file
      const updatedFileContent = this.replaceDefaultContent(currentFile.content, newContent);
      
      // Update the file
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
            content: btoa(updatedFileContent), // Encode to base64
            sha: currentFile.sha,
            branch: this.config.branch
          })
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Content updated successfully:', result.commit.sha);
      return result;
    } catch (error) {
      console.error('❌ Failed to update content:', error);
      throw error;
    }
  }

  // Replace the defaultContent object in the contentManager.ts file
  replaceDefaultContent(fileContent, newContent) {
    const contentString = JSON.stringify(newContent, null, 2);
    
    // Find the defaultContent export and replace it
    const regex = /export const defaultContent: ContentData = \{[\s\S]*?\};/;
    const replacement = `export const defaultContent: ContentData = ${contentString};`;
    
    if (regex.test(fileContent)) {
      return fileContent.replace(regex, replacement);
    } else {
      throw new Error('Could not find defaultContent export in file');
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

// Default content structure matching the website
const defaultContent = {
  hero: {
    headline: 'Fractional Partnership Leadership on Demand',
    subheadline: 'Get partnership expertise without the full-time hire. Solve growth challenges with proven leadership and rapid execution.',
    ctaText: 'Browse Service Packages'
  },
  about: {
    mainHeading: 'Why Two Fifths?',
    tagline: 'Revenue is a result, not a goal. Build a partner ecosystem on trust and shared purpose, and growth will take care of itself.',
    description: 'Growth doesn\'t happen in a vacuum. Most SaaS companies know partnerships can accelerate growth, but lack the expertise to execute effectively. Two Fifths brings battle-tested, fractional leadership to transform untapped opportunities into competitive advantages.',
    profileHeading: 'Two Fifths = Jason Cormier',
    profileSubtitle: 'Founder & Partnership Strategist',
    profilePoints: [
      'Two decades building and scaling partner programs and delivering measurable value',
      'Early pioneer for API platforms and integration partnerships in the APAC region',
      'Authored standardised digital transformation blueprints for government-scale programs',
      'Shopify alumnus with insider insights & a trusted ecommerce network that opens doors'
    ]
  },
  audienceSelector: {
    heading: 'Choose Your Path to Partnership Success',
    description: 'Click below to select the option that best describes your business and see tailored service packages specifically designed to address your needs.',
    australian: {
      title: 'Australian SaaS Companies',
      subtitle: 'Scale-up & Start-up Businesses',
      description: 'Partnerships feel like a struggle or "nice-to-have"? Get fractional strategic leadership to turn relationships into your growth engine.'
    },
    international: {
      title: 'International SaaS Companies',
      subtitle: 'Expanding to ANZ Markets',
      description: 'Ready for ANZ expansion but local nuances feel complex? Get on-ground expertise and networks for rapid, confident market entry.'
    }
  },
  testimonials: [
    {
      name: 'Sarah Chen',
      title: 'VP Growth at TechFlow SaaS',
      quote: 'Jason completely transformed our partnership approach. We went from having scattered, ineffective partnerships to a strategic program that now drives 40% of our new business. His expertise and network opened doors we didn\'t even know existed.'
    },
    {
      name: 'Marcus Rodriguez',
      title: 'CEO at DataSync Pro',
      quote: 'We struggled with partnerships for two years before Jason joined us. Within 90 days, he had us live with 5 major integrations and a clear roadmap for scaling. The ROI was immediate and substantial.'
    },
    {
      name: 'Emma Thompson',
      title: 'Head of International at CloudScale Global',
      quote: 'Jason\'s deep understanding of the ANZ market was game-changing for our expansion. His local relationships and strategic guidance helped us achieve in 6 months what would have taken us 2 years on our own.'
    }
  ],
  nextSteps: {
    heading: 'Next Steps',
    description: 'Still unsure where to start? Pick a conversation opener that works best for you.',
    formHeading: 'The Conversation Starts Here.',
    formDescription: 'Share your business overview and partnership goals. I\'ll respond within 24 hours with tailored insights and clear next steps. No sales pressure, just focused growth discussion.'
  },
  contact: {
    email: 'jason@twofifthsfractional.com',
    phone: '+61 423 161 718',
    location: 'Melbourne, Australia'
  }
};

// GitHub Authentication Component
const GitHubAuth = ({ onAuthChange }) => {
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

  useEffect(() => {
    if (onAuthChange) {
      onAuthChange(authState.isAuthenticated);
    }
  }, [authState.isAuthenticated, onAuthChange]);

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
        React.createElement('li', null, "Repository is set to: jasondavidcormier/twofifths-website")
      )
    )
  );
};

// Main CMS Component
const SimplifiedCMS = () => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('twofifths-simplified-cms-content');
    return saved ? JSON.parse(saved) : defaultContent;
  });
  
  const [lastSaved, setLastSaved] = useState(() => {
    const saved = localStorage.getItem('twofifths-simplified-cms-last-saved');
    return saved ? parseInt(saved) : null;
  });
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [isGitHubAuthenticated, setIsGitHubAuthenticated] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('twofifths-simplified-cms-content', JSON.stringify(content));
      const now = Date.now();
      localStorage.setItem('twofifths-simplified-cms-last-saved', now.toString());
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

  // Testimonial management
  const addTestimonial = () => {
    setContent(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', title: '', quote: '' }]
    }));
  };

  const removeTestimonial = (index) => {
    setContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  // Profile points management
  const addProfilePoint = () => {
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        profilePoints: [...prev.about.profilePoints, '']
      }
    }));
  };

  const removeProfilePoint = (index) => {
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        profilePoints: prev.about.profilePoints.filter((_, i) => i !== index)
      }
    }));
  };

  // Data management functions
  const handleSave = () => {
    localStorage.setItem('twofifths-simplified-cms-content', JSON.stringify(content));
    const now = Date.now();
    localStorage.setItem('twofifths-simplified-cms-last-saved', now.toString());
    setLastSaved(now);
    alert('Content saved successfully!');
  };

  const handleDeploy = async () => {
    if (!isGitHubAuthenticated) {
      setDeploymentStatus('Please connect to GitHub first');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('Preparing deployment...');
    
    try {
      setDeploymentStatus('Updating GitHub repository...');
      
      const result = await githubClient.updateContentManager(content, 
        `Update content from CMS - ${new Date().toLocaleString()}`
      );
      
      if (result) {
        setDeploymentStatus('✅ Content deployed to GitHub! Netlify will auto-deploy within 1-2 minutes.');
        
        // Save deployment info locally
        localStorage.setItem('twofifths-deployment-info', JSON.stringify({
          timestamp: Date.now(),
          status: 'deployed',
          source: 'cms-github',
          commitSha: result.commit.sha
        }));
      } else {
        throw new Error('Deployment failed');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      setDeploymentStatus(`❌ Deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
      setTimeout(() => setDeploymentStatus(''), 5000);
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

  return React.createElement('div', { className: "min-h-screen bg-gray-100" },
    // Header
    React.createElement('div', { className: "bg-white shadow-sm border-b" },
      React.createElement('div', { className: "max-w-6xl mx-auto px-6 py-4" },
        React.createElement('div', { className: "flex items-center justify-between" },
          React.createElement('h1', { className: "text-2xl font-bold text-gray-900" }, "Two Fifths CMS - Simplified"),
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
              disabled: isDeploying || !isGitHubAuthenticated,
              className: `px-4 py-2 rounded-lg transition-colors ${
                isDeploying || !isGitHubAuthenticated
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`
            }, isDeploying ? 'Deploying...' : 'Deploy to GitHub')
          )
        ),
        deploymentStatus && React.createElement('div', { 
          className: `mt-2 text-sm ${
            deploymentStatus.includes('failed') || deploymentStatus.includes('❌') 
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
      // GitHub Authentication
      React.createElement(GitHubAuth, { onAuthChange: setIsGitHubAuthenticated }),
      
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
              )
            )
          ),

          // About Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "About Section"),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Main Heading"),
                React.createElement('input', {
                  type: "text",
                  value: content.about.mainHeading,
                  onChange: (e) => updateContent(['about', 'mainHeading'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Tagline"),
                React.createElement('textarea', {
                  value: content.about.tagline,
                  onChange: (e) => updateContent(['about', 'tagline'], e.target.value),
                  rows: 2,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Description"),
                React.createElement('textarea', {
                  value: content.about.description,
                  onChange: (e) => updateContent(['about', 'description'], e.target.value),
                  rows: 4,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Profile Heading"),
                React.createElement('input', {
                  type: "text",
                  value: content.about.profileHeading,
                  onChange: (e) => updateContent(['about', 'profileHeading'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Profile Subtitle"),
                React.createElement('input', {
                  type: "text",
                  value: content.about.profileSubtitle,
                  onChange: (e) => updateContent(['about', 'profileSubtitle'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('div', { className: "flex items-center justify-between mb-2" },
                  React.createElement('label', { className: "block text-sm font-medium text-gray-700" }, "Profile Points"),
                  React.createElement('button', {
                    onClick: addProfilePoint,
                    className: "px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  }, "Add Point")
                ),
                React.createElement('div', { className: "space-y-2" },
                  content.about.profilePoints.map((point, index) =>
                    React.createElement('div', { key: index, className: "flex items-center space-x-2" },
                      React.createElement('input', {
                        type: "text",
                        value: point,
                        onChange: (e) => updateContent(['about', 'profilePoints', index], e.target.value),
                        className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }),
                      React.createElement('button', {
                        onClick: () => removeProfilePoint(index),
                        className: "px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      }, "Remove")
                    )
                  )
                )
              )
            )
          ),

          // Audience Selector Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Audience Selector"),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Main Heading"),
                React.createElement('input', {
                  type: "text",
                  value: content.audienceSelector.heading,
                  onChange: (e) => updateContent(['audienceSelector', 'heading'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Description"),
                React.createElement('textarea', {
                  value: content.audienceSelector.description,
                  onChange: (e) => updateContent(['audienceSelector', 'description'], e.target.value),
                  rows: 3,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              
              // Australian Audience
              React.createElement('div', { className: "border border-gray-200 rounded-lg p-4" },
                React.createElement('h3', { className: "font-medium text-gray-900 mb-3" }, "Australian SaaS Companies"),
                React.createElement('div', { className: "space-y-3" },
                  React.createElement('input', {
                    type: "text",
                    placeholder: "Title",
                    value: content.audienceSelector.australian.title,
                    onChange: (e) => updateContent(['audienceSelector', 'australian', 'title'], e.target.value),
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }),
                  React.createElement('input', {
                    type: "text",
                    placeholder: "Subtitle",
                    value: content.audienceSelector.australian.subtitle,
                    onChange: (e) => updateContent(['audienceSelector', 'australian', 'subtitle'], e.target.value),
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }),
                  React.createElement('textarea', {
                    placeholder: "Description",
                    value: content.audienceSelector.australian.description,
                    onChange: (e) => updateContent(['audienceSelector', 'australian', 'description'], e.target.value),
                    rows: 3,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  })
                )
              ),
              
              // International Audience
              React.createElement('div', { className: "border border-gray-200 rounded-lg p-4" },
                React.createElement('h3', { className: "font-medium text-gray-900 mb-3" }, "International SaaS Companies"),
                React.createElement('div', { className: "space-y-3" },
                  React.createElement('input', {
                    type: "text",
                    placeholder: "Title",
                    value: content.audienceSelector.international.title,
                    onChange: (e) => updateContent(['audienceSelector', 'international', 'title'], e.target.value),
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }),
                  React.createElement('input', {
                    type: "text",
                    placeholder: "Subtitle",
                    value: content.audienceSelector.international.subtitle,
                    onChange: (e) => updateContent(['audienceSelector', 'international', 'subtitle'], e.target.value),
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }),
                  React.createElement('textarea', {
                    placeholder: "Description",
                    value: content.audienceSelector.international.description,
                    onChange: (e) => updateContent(['audienceSelector', 'international', 'description'], e.target.value),
                    rows: 3,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  })
                )
              )
            )
          ),

          // Testimonials Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('div', { className: "flex items-center justify-between mb-4" },
              React.createElement('h2', { className: "text-xl font-semibold text-gray-900" }, "Testimonials"),
              React.createElement('button', {
                onClick: addTestimonial,
                className: "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              }, "Add Testimonial")
            ),
            React.createElement('div', { className: "space-y-6" },
              content.testimonials.map((testimonial, index) =>
                React.createElement('div', { 
                  key: index, 
                  className: "border border-gray-200 rounded-lg p-4" 
                },
                  React.createElement('div', { className: "flex items-center justify-between mb-3" },
                    React.createElement('h3', { className: "font-medium text-gray-900" }, `Testimonial ${index + 1}`),
                    React.createElement('button', {
                      onClick: () => removeTestimonial(index),
                      className: "text-red-600 hover:text-red-800 text-sm"
                    }, "Remove")
                  ),
                  React.createElement('div', { className: "space-y-3" },
                    React.createElement('input', {
                      type: "text",
                      placeholder: "Name",
                      value: testimonial.name,
                      onChange: (e) => updateContent(['testimonials', index, 'name'], e.target.value),
                      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }),
                    React.createElement('input', {
                      type: "text",
                      placeholder: "Title",
                      value: testimonial.title,
                      onChange: (e) => updateContent(['testimonials', index, 'title'], e.target.value),
                      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }),
                    React.createElement('textarea', {
                      placeholder: "Quote",
                      value: testimonial.quote,
                      onChange: (e) => updateContent(['testimonials', index, 'quote'], e.target.value),
                      rows: 4,
                      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }),
                    React.createElement('div', { className: "text-sm text-gray-500" },
                      `Word count: ${testimonial.quote.split(' ').filter(word => word.length > 0).length} words`
                    )
                  )
                )
              )
            )
          ),

          // Next Steps Section
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Next Steps Section"),
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Section Heading"),
                React.createElement('input', {
                  type: "text",
                  value: content.nextSteps.heading,
                  onChange: (e) => updateContent(['nextSteps', 'heading'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Description"),
                React.createElement('textarea', {
                  value: content.nextSteps.description,
                  onChange: (e) => updateContent(['nextSteps', 'description'], e.target.value),
                  rows: 3,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Form Heading"),
                React.createElement('input', {
                  type: "text",
                  value: content.nextSteps.formHeading,
                  onChange: (e) => updateContent(['nextSteps', 'formHeading'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Form Description"),
                React.createElement('textarea', {
                  value: content.nextSteps.formDescription,
                  onChange: (e) => updateContent(['nextSteps', 'formDescription'], e.target.value),
                  rows: 3,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
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
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Location"),
                React.createElement('input', {
                  type: "text",
                  value: content.contact.location,
                  onChange: (e) => updateContent(['contact', 'location'], e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                })
              )
            )
          )
        ),

        // Right column - Tools and preview
        React.createElement('div', { className: "space-y-8" },
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
          ),

          // Quick Stats
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-900" }, "Content Stats"),
            React.createElement('div', { className: "space-y-3 text-sm" },
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "Testimonials:"),
                React.createElement('span', { className: "font-medium" }, content.testimonials.length)
              ),
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "Profile Points:"),
                React.createElement('span', { className: "font-medium" }, content.about.profilePoints.length)
              ),
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "Hero Headline Length:"),
                React.createElement('span', { className: "font-medium" }, `${content.hero.headline.length} chars`)
              ),
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "About Description Length:"),
                React.createElement('span', { className: "font-medium" }, `${content.about.description.length} chars`)
              )
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
  root.render(React.createElement(SimplifiedCMS));
} else {
  console.error('Root container not found');
}