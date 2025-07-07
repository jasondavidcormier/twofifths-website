// Content management utilities for static content
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
    credentials: Array<{
      title: string;
      description: string;
    }>;
    profileHeading: string;
    profileSubtitle: string;
    profilePoints: string[];
    logoStripCaption: string;
  };
  audienceSelector: {
    heading: string;
    description: string;
    helperText: string;
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
    quote: string;
  }>;
  nextSteps: {
    heading: string;
    description: string;
    callouts: Array<{
      title: string;
      description: string;
    }>;
    formHeading: string;
    formDescription: string;
    benefits: string[];
  };
  footer: {
    blurb: string;
    email: string;
    phone: string;
    location: string;
    services: string[];
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

// Static content
export const defaultContent: ContentData = {
  hero: {
    headline: 'Fractional Partnership Leadership on Demand',
    subheadline: 'Get partnership expertise without the full-time hire. Solve growth challenges with proven leadership and rapid execution.',
    ctaText: 'Browse Service Packages'
  },
  about: {
    mainHeading: 'Why Two Fifths?',
    tagline: 'Revenue is a result, not a goal. Build a partner ecosystem on trust and shared purpose, and growth will take care of itself.',
    description: 'Growth doesn\'t happen in a vacuum. Most SaaS companies know partnerships can accelerate growth, but lack the expertise to execute effectively. Two Fifths brings battle-tested, fractional leadership to transform untapped opportunities into competitive advantages.',
    credentials: [
      {
        title: '20+ Years Ecosystem Mastery',
        description: 'Deep expertise in building value from partnerships, API platforms, and developer communities with a proven track record turning integrations into revenue engines.'
      },
      {
        title: 'High Trust & Deep Network',
        description: 'Background at leading companies like Shopify, Linktree, and Lonely Planet, plus a respected network across ANZ retail tech and ecommerce communities.'
      },
      {
        title: 'Fractional by Design',
        description: 'Senior-level partnership expertise, part-time but on-demand, designed specifically for start-up and scale-up businesses.'
      },
      {
        title: 'Market Entry Architect',
        description: 'Specialised experience guiding US/UK SaaS businesses into ANZ markets, leveraging networks and local expertise for successful expansion.'
      }
    ],
    profileHeading: 'Two Fifths = Jason Cormier',
    profileSubtitle: 'Founder & Partnership Strategist',
    profilePoints: [
      'Two decades building and scaling partner programs and delivering measurable value',
      'Early pioneer for API platforms and integration partnerships in the APAC region',
      'Authored standardised digital transformation blueprints for government-scale programs',
      'Shopify alumnus with insider insights & a trusted ecommerce network that opens doors'
    ],
    logoStripCaption: 'Successfully built, managed, and grew partner programs for brands you know'
  },
  audienceSelector: {
    heading: 'Choose Your Path to Partnership Success',
    description: 'Click below to select the option that best describes your business and see tailored service packages specifically designed to address your needs.',
    helperText: 'We\'ve bundled key services to make it easier to get started with us.',
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
    },
    {
      name: 'David Kim',
      title: 'Founder at ScaleUp Solutions',
      quote: 'The partnership strategy Jason developed for us was exactly what we needed. His systematic approach to partner identification and onboarding helped us establish 8 key partnerships in our first quarter working together.'
    },
    {
      name: 'Lisa Martinez',
      title: 'Head of Business Development at GrowthTech',
      quote: 'Jason\'s expertise in the ANZ market was invaluable for our expansion. He not only connected us with the right partners but also helped us navigate the cultural nuances that made all the difference in our success.'
    },
    {
      name: 'Alex Johnson',
      title: 'VP Partnerships at CloudConnect',
      quote: 'Working with Jason was a game-changer. His deep network and strategic thinking helped us identify partnership opportunities we never would have found on our own. The results speak for themselves - 60% revenue growth in 8 months.'
    }
  ],
  nextSteps: {
    heading: 'Next Steps',
    description: 'Still unsure where to start? Pick a conversation opener that works best for you.',
    callouts: [
      {
        title: '30 Minute Discovery Call',
        description: 'Let\'s openly discuss your current challenges and ambitions. We\'ll identify key opportunities and a potential path forward.'
      },
      {
        title: 'Async Jam Session',
        description: 'Share your existing partner program (or even just an idea). I\'ll provide analysis with actionable, no-fluff feedback.'
      },
      {
        title: 'Market Fit Assessment',
        description: 'Tell me your aspirations to grow in ANZ. I\'ll share some critical strategic advantages you have, and potential blind spots you\'re overlooking.'
      },
      {
        title: 'Custom Proposal',
        description: 'Your business is unique. Let\'s collaborate to design a bespoke partnership solution that precisely fits your strategic objectives and desired outcomes.'
      }
    ],
    formHeading: 'The Conversation Starts Here.',
    formDescription: 'Share your business overview and partnership goals. I\'ll respond within 24 hours with tailored insights and clear next steps. No sales pressure, just focused growth discussion.',
    benefits: [
      'Free 30-minute strategic consultation',
      'Personalised partnership strategy recommendations',
      'Pure value, zero obligation'
    ]
  },
  footer: {
    blurb: 'Two Fifths Fractional: Strategic Partnership Leadership for SaaS. We deliver senior-level expertise, on demand, enabling you to scale through high-impact partnerships without the full-time commitment.',
    email: 'jason@twofifthsfractional.com',
    phone: '+61 423 161 718',
    location: 'Melbourne, Australia',
    services: [
      'Fractional Partnership Leadership',
      'Partnership Strategy & Execution',
      'ANZ Market Entry & Expansion',
      'Partnership Program Audits & Optimisation',
      'Strategic Advisory & Coaching'
    ]
  },
  servicePackages: {
    australian: {
      sectionHeading: 'Solutions for Australian SaaS Companies',
      opportunityText: 'Partnerships are a top priority for most executives, who understand they can deliver leads that are exponentially more valuable than traditional channels. But too often, programs lack strategic focus and partners take over a year to become productive. Two Fifths bridges this gap with dedicated, senior-level partnership leadership that drives proven impact.',
      packages: [
        {
          title: 'Fractional Partnership Architect',
          subtitle: '2-3 days/week',
          description: 'Your Strategic Growth Partner. More than a consultant; it\'s an embedded executive. We build, execute, and scale your entire partnership function from strategy to everyday wins, integrating seamlessly with your team.',
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
          description: 'Audit & Optimise Your Ecosystem. Your partnerships exist, but are they performing? This engagement provides a forensic audit of your current program, diagnosing what\'s broken and delivering a precise blueprint for immediate and long-term optimisation.',
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
          description: 'Launchpad for New Initiatives. You have a vision for partnerships, but need clarity on the path. This sprint delivers a rapid, data-backed strategy, identifying your ideal partners, defining mutual value, and charting your precise go-to-market plan.',
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
          description: 'Empower Your Internal Team. You have the internal drive, but need an experienced thought partner to navigate the complexities. This package provides ongoing, strategic guidance and direct coaching to elevate your team\'s capabilities and accelerate your success.',
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
      opportunityText: 'The ANZ market represents a $50B+ ecommerce opportunity. Success requires more than a website. You need local expertise, relationships, and cultural understanding. Two Fifths is your on-ground accelerator for confident, rapid market entry.',
      packages: [
        {
          title: 'Market Validation Sprint',
          subtitle: '4-6 week project',
          description: 'De-Risk Your Entry. Before you commit significant resources, validate the opportunity size. This sprint provides comprehensive market research, competitive analysis, and strategic partnership mapping tailored specifically for your successful entry.',
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
          description: 'Seed Your Local Ecosystem and establish a critical local footprint. This engagement systematically identifies, engages, and builds relationships with key regional partners, creating a robust foundation for sustainable growth and market penetration.',
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
          description: 'Your Local Voice & Face. Maintain a consistent, credible presence without a full local team. We act as your trusted on-the-ground representative, nurturing key relationships, identifying new opportunities, and providing invaluable real-time local intelligence.',
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
          description: 'Systematic Market Domination. This comprehensive program focuses on aggressive partner activation, robust revenue pipeline development, and strategic positioning for long-term market leadership.',
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

// Simple content manager for static content
class ContentManager {
  private static instance: ContentManager;
  private content: ContentData;
  private listeners: Array<(content: ContentData) => void> = [];

  private constructor() {
    this.content = defaultContent;
  }

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  getContent(): ContentData {
    return this.content;
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
}

export const contentManager = ContentManager.getInstance();