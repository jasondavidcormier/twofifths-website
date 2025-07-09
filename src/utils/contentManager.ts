// Content management utilities for dynamic content updates
export interface ContentData {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: {
    mainHeading: string;
    tagline: string;
    description: string;
    profileHeading: string;
    profileSubtitle: string;
    profilePoints: string[];
  };
  audienceSelector: {
    heading: string;
    description: string;
    australian: {
      title: string;
      subtitle: string;
      description: string;
    };
    international: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
  testimonials: Array<{
    name: string;
    title: string;
    company: string;
    quote: string;
  }>;
  nextSteps: {
    heading: string;
    description: string;
    formHeading: string;
    formDescription: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  servicePackages: {
    australian: {
      sectionHeading: string;
      opportunityText: string;
      packages: Array<{
        title: string;
        subtitle: string;
        description: string;
        features: string[];
        ideal: string;
      }>;
    };
    international: {
      sectionHeading: string;
      opportunityText: string;
      packages: Array<{
        title: string;
        subtitle: string;
        description: string;
        features: string[];
        ideal: string;
      }>;
    };
  };
}

// Default content
export const defaultContent: ContentData = {
  hero: {
    headline: 'Fractional Partnership Leadership on Demand', 
    subheadline: 'Stop leaving revenue on the table. Get access to a veteran partnership leader now, without the burden of a full-time hire.',
    ctaText: 'Browse Service Packages'
  },
  about: {
    mainHeading: 'Why Two-Fifths?',
    tagline: 'Revenue is a result, not a goal. Build a partner ecosystem on a foundation of trust and shared purpose, and growth will take care of itself.',
    description: 'Growth doesn\'t happen in a vacuum. Most SaaS companies know partnerships can accelerate growth, but lack the expertise to execute effectively. I bring battle-tested, fractional leadership to transform your untapped opportunities into competitive advantages.',
    profileHeading: 'Two-Fifths is Jason Cormier',
    profileSubtitle: 'Founder & Senior Partnership Strategist',
    profilePoints: [
      'Two decades building and scaling partner programs and delivering measurable value',
      'Early pioneer for API platforms and integration partnerships in the APAC region',
      'Authored standardised digital transformation blueprints for government-scale programs',
      'Shopify alumnus with insider insights & a trusted ecommerce network that opens doors'
    ]
  },
  audienceSelector: {
    heading: 'Choose Your Path to Partnership Success',
    description: 'the option that best describes your business and view tailored service packages for your needs.',
    australian: {
      title: 'Australian SaaS Companies',
      subtitle: 'Scale-up & Start-up Businesses',
      description: 'Partnerships feel like a struggle or a "nice-to-have"? Fractional leadership turns relationships into a growth engine, without the cost of a full-time hire.'
    },
    international: {
      title: 'International SaaS Companies',
      subtitle: 'Expanding to ANZ Markets',
      description: 'Ready for ANZ expansion but local nuances feel complex? Navigate with confidence thanks to on-ground expertise and established networks that set you up for success.'
    }
  },
  testimonials: [
    {
      name: 'Rob Hango-Zada',
      title: 'Co-Founder and Co-CEO',
      company: 'Shippit',
      quote: 'Jason is a natural relationship builder, connector and all round big thinker. His deep understanding of what it takes to build enduring partnerships along with his pragmatic approach helped us completely redefine partnerships at Shippit.'
    },
    {
      name: 'Lee Hardham',
      title: 'Founder and CEO',
      company: 'Brauz',
      quote: 'Jason\'s ability to manage partner relationships is exemplary. He fostered a truly collaborative win-win environment where our team felt supported and highly valued. This led to stronger relationships and more successful joint initiatives than we\'d seen before.'
    },
    {
      name: 'Jeff Trounce',
      title: 'Global Manager Client Solutions',
      company: 'Lonely Planet',
      quote: 'Jason\'s got a rare knack for cross-functional collaboration and getting things done. At Lonely Planet, he got results through persistence, expertly handling complex issues. He truly understands how marketing intersects with new partnerships, driving efficient, low-cost outcomes.'
    },
    {
      name: 'Jimmy Zhong',
      title: 'CEO and Co-founder',
      company: 'Syncio',
      quote: 'Navigating the Shopify App Ecosystem can be challenging, but Jason\'s invaluable advice directly led to our improved growth and market visibility. His authentic expertise in partnerships and ecosystem development is truly commendable and highly recommended.'
    },
    {
      name: 'Charlotte Michalanney',
      title: 'Head of Marketing',
      company: 'Convert Digital',
      quote: 'Working with Jason highlighted the value and impact of stronger partnerships. He ensured we always felt supported and that he had our best interests at heart, which not only strengthened our relationships but also drove greater mutual success. A true professional.'
    },
    {
      name: 'Keran McKenzie',
      title: 'Head of Ecosystem',
      company: 'MYOB',
      quote: 'Jason\'s the real deal for building partner ecosystems. He helped us scale MYOB from zero to thousands of developers. He brings the right tools, tech, programs, and strategic thinking, understanding both the business and people side of partnerships. He just delivers.'
    },
    {
      name: 'Robert Gibson',
      title: 'Head of APAC Partnerships',
      company: 'Klaviyo',
      quote: 'Getting Klaviyo set up in ANZ was a lot of work, but Jason\'s help was meaningful. His Shopify experience, local industry knowledge, and connections really made a difference. His encouragement and advice were also invaluable! He was a big part of our local success.'
    },
    {
      name: 'Elliot Spirrett',
      title: 'Head of Partnerships ANZ',
      company: 'GoCardless',
      quote: 'Jason is an invaluable mentor. His vast experience across diverse industries and company stages means he\'s accumulated immense insight. He\'s always ready to share that knowledge and nurture others, which I\'m incredibly grateful for in our work together.'
    },
    {
      name: 'Matt Holme',
      title: 'Founder and CEO',
      company: 'YouPay',
      quote: 'When Jason was helping us get our payment integration working he was always very helpful and provided meaningful support and advice. His knowledge of the Shopify ecosystem is really deep, which helped us navigate many complexities.'
    },
    {
      name: 'Rhys Furner',
      title: 'Director of Partnerships APAC',
      company: 'Shopify',
      quote: 'Jason\'s energy and creativity have earned him a stellar reputation in the industry, he knows everyone and is highly respected. His ability to connect the right people and companies was critical in growing our partner ecosystem and creating new opportunities for Shopify.'
    },
    {
      name: 'Gaelle Decolnet',
      title: 'Channel and Alliance APAC',
      company: 'Fluent Commerce',
      quote: 'Jason embodies a truly great partner manager. His rigor, consistency, and strong business acumen ensure both companies are served. His unmatched partnership skills drive pipeline through valuable joint activities, connecting the right people and making everyone feel genuinely supported.'
    },
    {
      name: 'Shauna Butcher',
      title: 'Head of Marketing',
      company: 'Shippit',
      quote: 'Working with Jason on partner marketing was great. His creativity and focus on mutual benefit were key. He expertly managed diverse partners, agendas, and personalities, pulling everyone together to deliver significantly better joint marketing results. A true collaborator.'
    },
    {
      name: 'Paul Goldston',
      title: 'Head of APAC',
      company: 'Order Editing',
      quote: 'Jason\'s reputation totally precedes him. He\'s got an incredible knack for connecting people, and that\'s been huge for boosting the Shopify ecosystem in ANZ and finding new opportunities for partners.'
    }
  ],
  nextSteps: {
    heading: 'Next Steps',
    description: 'Still unsure where to start? Pick a conversation starter that works best for you.',
    formHeading: 'Let\'s Connect',
    formDescription: 'Share your business overview and partnership goals. I\'ll respond within 24 hours with tailored insights and clear next steps. No sales pressure, just a focused growth discussion.'
  },
  contact: {
    email: 'jason@twofifthsfractional.com',
    phone: '+61 423 161 718',
    location: 'Melbourne, Australia'
  },
  servicePackages: {
    australian: {
      sectionHeading: 'Solutions for Australian SaaS Companies',
      opportunityText: 'Partnerships are a top priority for most executives, who understand they can deliver leads that are exponentially more valuable than traditional channels. But too often, programs lack strategic focus and partners take over a year to become productive. I bridge this gap with dedicated, senior-level partnership leadership that drives proven impact.',
      packages: [
        {
          title: 'Fractional Partnership Architect',
          subtitle: '2-3 days/week',
          description: 'Your strategic growth partner. More than a consultant; it\'s an embedded executive. I build, execute, and scale your entire partnership function from strategy to everyday wins, integrating seamlessly with your team.',
          features: [
            'Strategy & execution aligned to your organisational goals',
            'Partner recruitment, onboarding, and enablement',
            'Cross-functional team alignment and collaboration',
            'Data-driven optimisation and performance monitoring'
          ],
          ideal: 'Perfect for ambitious SaaS companies ready to make partnerships a primary growth lever, but not yet ready for the overhead of a permanent senior hire.'
        },
        {
          title: 'Partnership Program Blueprint',
          subtitle: '2-4 week engagement',
          description: 'Audit and optimise your ecosystem. Your partnerships exist, but are they performing? I provide a forensic audit of your current program, diagnosing what\'s broken and delivering a precise blueprint for immediate and long-term optimisation.',
          features: [
            'Comprehensive analysis of current partnerships and GTM approach',
            'Partner ROI evaluation and strategic gap identification',
            'Prioritised roadmap for process and technology improvements',
            'Internal alignment and partner commitment assessment'
          ],
          ideal: 'Ideal for SaaS businesses with existing partnership programs struggling to scale, achieve clear ROI, or facing misaligned expectations.'
        },
        {
          title: 'Strategic Partnership Sprint',
          subtitle: '3-6 week project',
          description: 'Launchpad for new initiatives. You have a vision for partnerships, but need clarity on the path. I deliver a rapid, data-backed strategy, identifying your ideal partners, defining mutual value, and charting your precise go-to-market plan.',
          features: [
            'Strategic partner identification and integration mapping',
            'Partnership framework and value proposition development',
            'Monetisation models and value exchange definition',
            'Implementation roadmap with milestones and success metrics'
          ],
          ideal: 'Great for anyone at the genesis of their partnership journey, or those launching a significant new initiative, seeking a clear, confident start.'
        },
        {
          title: 'Advisory & Executive Coaching',
          subtitle: '4-8 hours per month',
          description: 'Empower your internal team. You have the internal drive, but need an experienced thought partner to navigate the complexities. I provide ongoing, strategic guidance and direct coaching to elevate your team\'s capabilities and accelerate your success.',
          features: [
            'Regular strategic sessions and partnership approach refinement',
            'Deal evaluation, structuring, and value maximisation',
            'Team coaching on acquisition, enablement, and GTM execution',
            'Strategic introductions and network connections'
          ],
          ideal: 'Perfect for SaaS companies with an emerging internal partnership function, or founders who want a trusted adviser to ensure their partnership strategy is sharp and effective.'
        }
      ]
    },
    international: {
      sectionHeading: 'Solutions for International SaaS Companies',
      opportunityText: 'The ANZ market represents a $50B+ ecommerce opportunity. Success requires more than a website. You need local expertise, relationships, and cultural understanding. Two-Fifths is your on-ground accelerator for confident, rapid market entry.',
      packages: [
        {
          title: 'Market Validation Sprint',
          subtitle: '4-6 week project',
          description: 'De-risk your entry. Before you commit significant resources, validate the opportunity size. I provide comprehensive market research, competitive analysis, and strategic partnership mapping tailored specifically for your successful entry.',
          features: [
            'Market opportunity sizing for your specific SaaS offering',
            'Competitive landscape and white space analysis',
            'Local partnership ecosystem and channel mapping',
            'Go-to-market plan with local insights and networks'
          ],
          ideal: 'International SaaS companies meticulously evaluating the ANZ market, seeking to minimise risk and maximise the impact of their initial strategic investments.'
        },
        {
          title: 'Partner Network Foundation',
          subtitle: '3-6 month engagement',
          description: 'Seed your local ecosystem and establish a critical local footprint. I systematically identify, engage, and build relationships with key regional partners, creating a robust foundation for sustainable growth and market penetration.',
          features: [
            'Partner identification and outreach through local networks',
            'Relationship building, negotiation, and agreement structuring',
            'Program launch support and partner onboarding',
            'Strategic prioritisation for highest-impact partnerships'
          ],
          ideal: 'Ideal for companies ready to build a strong, localised partnership network as their cornerstone for ANZ market penetration.'
        },
        {
          title: 'Local Market Representation',
          subtitle: '2 days per week ongoing',
          description: 'Your local voice and face. Maintain a consistent, credible presence without a full local team. I act as your trusted on-the-ground representative, nurturing key relationships, identifying new opportunities, and providing invaluable real-time local intelligence.',
          features: [
            'Brand representation and local credibility building',
            'Ongoing partner relationship management and growth',
            'Industry event participation and strategic networking',
            'Real-time market intelligence and competitive insights'
          ],
          ideal: 'Great for international SaaS companies requiring a consistent, expert presence in the ANZ market to sustain momentum, deepen relationships, and capture emerging opportunities.'
        },
        {
          title: 'Growth Acceleration Program',
          subtitle: '6-12 month program',
          description: 'Systematic market domination. I focus on aggressive partner activation, robust revenue pipeline development, and strategic positioning for long-term market leadership.',
          features: [
            'Partner activation and performance management for deals',
            'Revenue pipeline development through strategic introductions',
            'Data-driven optimisation of highest-impact initiatives',
            'Local team preparation and transition planning'
          ],
          ideal: 'Perfect for international companies committed to aggressive growth and seeking sustained market leadership within the ANZ region, aiming for a systematic and highly optimised scale-up.'
        }
      ]
    }
  }
};

// Content storage and retrieval
class ContentManager {
  private static instance: ContentManager;
  private content: ContentData;
  private listeners: Array<(content: ContentData) => void> = [];
  private static readonly BOLT_DEPLOYMENT_KEY = 'twofifths-bolt-deployment';
  private static readonly CMS_STORAGE_KEYS = [
    'twofifths-content',
    'twofifths-live-content', 
    'twofifths-deployment-info',
    'cms-authenticated'
  ];

  private constructor() {
    // Mark this as a Bolt deployment and clear all CMS storage
    this.markBoltDeployment();
    this.content = this.loadContent();
  }

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  private markBoltDeployment(): void {
    try {
      const deploymentInfo = {
        timestamp: Date.now(),
        source: 'bolt',
        version: '1.0.0'
      };
      localStorage.setItem(ContentManager.BOLT_DEPLOYMENT_KEY, JSON.stringify(deploymentInfo));
      
      // Clear ALL CMS storage to prevent conflicts
      ContentManager.CMS_STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Bolt deployment marked, CMS storage cleared');
    } catch (error) {
      console.warn('Failed to mark Bolt deployment:', error);
    }
  }

  private loadContent(): ContentData {
    try {
      // Always use defaultContent on fresh Bolt deployment
      const stored = localStorage.getItem('twofifths-content');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored content, using defaults');
    }
    return defaultContent;
  }

  // Get deployment info for CMS to check
  static getBoltDeploymentInfo(): { timestamp: number; source: string; version: string } | null {
    try {
      const stored = localStorage.getItem(ContentManager.BOLT_DEPLOYMENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  private saveContent(): void {
    try {
      localStorage.setItem('twofifths-content', JSON.stringify(this.content));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  }

  getContent(): ContentData {
    return this.content;
  }

  updateContent(newContent: ContentData): void {
    this.content = newContent;
    this.saveContent();
  }

  subscribe(listener: (content: ContentData) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.content));
  }

  // Check for content updates from CMS
  checkForUpdates(): void {
    try {
      // Priority 1: Check for Google Drive updates (highest priority)
      this.checkGoogleDriveContent();
      
      // Priority 2: Check for Netlify-deployed content
      const netlifyContent = this.checkNetlifyDeployedContent();
      if (netlifyContent) {
        this.content = netlifyContent;
        this.saveContent();
        this.notifyListeners();
        console.log('✅ Netlify-deployed content applied');
        return;
      }
      
      // Priority 3: Check for pending Netlify deployment
      const pendingContent = this.checkPendingNetlifyContent();
      if (pendingContent) {
        this.content = pendingContent;
        this.saveContent();
        this.notifyListeners();
        console.log('✅ Pending Netlify content applied');
        return;
      }
      
      // Priority 4: Check for direct CMS updates (fallback)
      this.checkDirectCMSUpdates();
      
    } catch (error) {
      console.warn('Failed to check for content updates:', error);
    }
  }

  private checkGoogleDriveContent(): void {
    try {
      // Priority 1: Check for auto-sync updates
      const autoSyncUpdate = localStorage.getItem('twofifths-google-drive-auto-sync');
      if (autoSyncUpdate) {
        const updateData = JSON.parse(autoSyncUpdate);
        if (!updateData.processed && this.validateContent(updateData.content)) {
          this.content = updateData.content;
          this.saveContent();
          this.notifyListeners();
          
          // Mark as processed
          updateData.processed = true;
          localStorage.setItem('twofifths-google-drive-auto-sync', JSON.stringify(updateData));
          
          console.log('✅ Google Drive auto-sync content applied');
          return;
        }
      }
      
      // Check for recent Google Drive updates
      const googleDriveUpdate = localStorage.getItem('twofifths-last-google-drive-update');
      if (googleDriveUpdate) {
        const updateData = JSON.parse(googleDriveUpdate);
        
        // Only process if not already processed
        if (!updateData.processed && this.validateContent(updateData.content)) {
          this.content = updateData.content;
          this.saveContent();
          this.notifyListeners();
          
          // Mark as processed
          updateData.processed = true;
          localStorage.setItem('twofifths-last-google-drive-update', JSON.stringify(updateData));
          
          console.log('✅ Google Drive content update applied');
          return;
        }
      }
      
      // Check for Google Drive content in standard location
      const googleDriveContent = localStorage.getItem('twofifths-google-drive-content');
      if (googleDriveContent) {
        const parsedData = JSON.parse(googleDriveContent);
        if (this.validateContent(parsedData.content)) {
          this.content = parsedData.content;
          this.saveContent();
          this.notifyListeners();
          
          // Clear the Google Drive content flag
          localStorage.removeItem('twofifths-google-drive-content');
          console.log('✅ Google Drive content applied');
        }
      }
    } catch (error) {
      console.warn('Error checking Google Drive content:', error);
    }
  }

  private checkNetlifyDeployedContent(): ContentData | null {
    try {
      // Check if content was deployed via Netlify environment variables
      const envContent = this.getEnvironmentContent();
      if (envContent) {
        return envContent;
      }
      
      // Check for Netlify-deployed content first
      const netlifyContent = localStorage.getItem('twofifths-netlify-content');
      if (netlifyContent) {
        const parsedData = JSON.parse(netlifyContent);
        if (this.validateContent(parsedData.content)) {
          localStorage.removeItem('twofifths-netlify-content');
          return parsedData.content;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Error checking Netlify content:', error);
      return null;
    }
  }

  private checkPendingNetlifyContent(): ContentData | null {
    try {
      // Check for content that's waiting for Netlify deployment
      const pendingContent = localStorage.getItem('twofifths-pending-deployment');
      if (pendingContent) {
        const parsedData = JSON.parse(pendingContent);
        if (this.validateContent(parsedData.content)) {
          // Don't remove pending content until deployment is confirmed
          return parsedData.content;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Error checking pending content:', error);
      return null;
    }
  }

  private checkDirectCMSUpdates(): void {
    try {
      // Fallback to local content updates
      const liveContent = localStorage.getItem('twofifths-live-content');
      if (liveContent) {
        const parsedContent = JSON.parse(liveContent);
        if (this.validateContent(parsedContent)) {
          this.content = parsedContent;
          this.saveContent(); // Save to regular storage
          this.notifyListeners();
          console.log('✅ Local content update applied');
        }
        // Clear the update flag
        localStorage.removeItem('twofifths-live-content');
      }
    } catch (error) {
      console.warn('Error checking direct CMS updates:', error);
    }
  }

  private getEnvironmentContent(): ContentData | null {
    try {
      // In a real Netlify deployment, this would come from environment variables
      // For now, we'll simulate this by checking a special localStorage key
      const envContentKey = 'TWOFIFTHS_CMS_CONTENT';
      const envTimestampKey = 'TWOFIFTHS_CONTENT_TIMESTAMP';
      
      // Check if we have environment-based content
      const envContent = localStorage.getItem(envContentKey);
      const envTimestamp = localStorage.getItem(envTimestampKey);
      
      if (envContent && envTimestamp) {
        // Check if this is newer than our current content
        const lastUpdate = localStorage.getItem('twofifths-last-env-update');
        if (!lastUpdate || parseInt(envTimestamp) > parseInt(lastUpdate)) {
          try {
            // Decode base64 content
            const decodedContent = atob(envContent);
            const parsedContent = JSON.parse(decodedContent);
            
            if (this.validateContent(parsedContent)) {
              // Mark this update as processed
              localStorage.setItem('twofifths-last-env-update', envTimestamp);
              return parsedContent;
            }
          } catch (decodeError) {
            console.warn('Failed to decode environment content:', decodeError);
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Error getting environment content:', error);
      return null;
    }
  }

  private validateContent(content: ContentData): boolean {
    // Basic validation
    if (!content?.hero?.headline || !content?.hero?.subheadline) {
      return false;
    }
    if (!content?.about?.mainHeading || !content?.about?.description) {
      return false;
    }
    if (!content?.testimonials || !Array.isArray(content.testimonials)) {
      return false;
    }
    return true;
  }

  // Force reload content from storage
  reloadContent(): void {
    this.content = this.loadContent();
    this.notifyListeners();
  }
}

export const contentManager = ContentManager.getInstance();
