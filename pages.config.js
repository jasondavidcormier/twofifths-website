module.exports = {
  // Site configuration
  site: {
    name: 'Two Fifths Website',
    url: 'https://twofifthsfractional.com',
    description: 'Fractional Partnership Leadership for SaaS Companies'
  },

  // Content configuration
  content: {
    // Hero Section
    hero: {
      label: 'Hero Section',
      fields: {
        headline: {
          type: 'text',
          label: 'Main Headline',
          required: true
        },
        subheadline: {
          type: 'textarea',
          label: 'Subheadline',
          required: true
        },
        ctaText: {
          type: 'text',
          label: 'CTA Button Text',
          required: true
        }
      }
    },

    // About Section
    about: {
      label: 'About Section',
      fields: {
        mainHeading: {
          type: 'text',
          label: 'Main Heading',
          required: true
        },
        tagline: {
          type: 'textarea',
          label: 'Tagline',
          required: true
        },
        description: {
          type: 'textarea',
          label: 'Description',
          required: true
        },
        credentials: {
          type: 'list',
          label: 'Credentials',
          fields: {
            title: {
              type: 'text',
              label: 'Title',
              required: true
            },
            description: {
              type: 'textarea',
              label: 'Description',
              required: true
            }
          }
        },
        profileHeading: {
          type: 'text',
          label: 'Profile Heading',
          required: true
        },
        profileSubtitle: {
          type: 'text',
          label: 'Profile Subtitle',
          required: true
        },
        profilePoints: {
          type: 'list',
          label: 'Profile Points',
          item_type: 'text'
        },
        logoStripCaption: {
          type: 'text',
          label: 'Logo Strip Caption',
          required: true
        }
      }
    },

    // Audience Selector
    audienceSelector: {
      label: 'Audience Selector',
      fields: {
        heading: {
          type: 'text',
          label: 'Main Heading',
          required: true
        },
        description: {
          type: 'textarea',
          label: 'Description',
          required: true
        },
        helperText: {
          type: 'text',
          label: 'Helper Text',
          required: true
        },
        australian: {
          type: 'object',
          label: 'Australian Option',
          fields: {
            title: {
              type: 'text',
              label: 'Title',
              required: true
            },
            subtitle: {
              type: 'text',
              label: 'Subtitle',
              required: true
            },
            description: {
              type: 'textarea',
              label: 'Description',
              required: true
            }
          }
        },
        international: {
          type: 'object',
          label: 'International Option',
          fields: {
            title: {
              type: 'text',
              label: 'Title',
              required: true
            },
            subtitle: {
              type: 'text',
              label: 'Subtitle',
              required: true
            },
            description: {
              type: 'textarea',
              label: 'Description',
              required: true
            }
          }
        }
      }
    },

    // Testimonials
    testimonials: {
      label: 'Testimonials',
      type: 'list',
      fields: {
        name: {
          type: 'text',
          label: 'Name',
          required: true
        },
        title: {
          type: 'text',
          label: 'Title',
          required: true
        },
        quote: {
          type: 'textarea',
          label: 'Quote',
          required: true
        }
      }
    },

    // Service Packages
    servicePackages: {
      label: 'Service Packages',
      fields: {
        australian: {
          type: 'object',
          label: 'Australian Packages',
          fields: {
            sectionHeading: {
              type: 'text',
              label: 'Section Heading',
              required: true
            },
            opportunityText: {
              type: 'textarea',
              label: 'Opportunity Text',
              required: true
            },
            packages: {
              type: 'list',
              label: 'Packages',
              fields: {
                title: {
                  type: 'text',
                  label: 'Title',
                  required: true
                },
                subtitle: {
                  type: 'text',
                  label: 'Subtitle',
                  required: true
                },
                description: {
                  type: 'textarea',
                  label: 'Description',
                  required: true
                },
                features: {
                  type: 'list',
                  label: 'Features',
                  item_type: 'text'
                },
                ideal: {
                  type: 'textarea',
                  label: 'Ideal For',
                  required: true
                }
              }
            }
          }
        },
        international: {
          type: 'object',
          label: 'International Packages',
          fields: {
            sectionHeading: {
              type: 'text',
              label: 'Section Heading',
              required: true
            },
            opportunityText: {
              type: 'textarea',
              label: 'Opportunity Text',
              required: true
            },
            packages: {
              type: 'list',
              label: 'Packages',
              fields: {
                title: {
                  type: 'text',
                  label: 'Title',
                  required: true
                },
                subtitle: {
                  type: 'text',
                  label: 'Subtitle',
                  required: true
                },
                description: {
                  type: 'textarea',
                  label: 'Description',
                  required: true
                },
                features: {
                  type: 'list',
                  label: 'Features',
                  item_type: 'text'
                },
                ideal: {
                  type: 'textarea',
                  label: 'Ideal For',
                  required: true
                }
              }
            }
          }
        }
      }
    },

    // Next Steps
    nextSteps: {
      label: 'Next Steps',
      fields: {
        heading: {
          type: 'text',
          label: 'Main Heading',
          required: true
        },
        description: {
          type: 'textarea',
          label: 'Description',
          required: true
        },
        callouts: {
          type: 'list',
          label: 'Step Callouts',
          fields: {
            title: {
              type: 'text',
              label: 'Title',
              required: true
            },
            description: {
              type: 'textarea',
              label: 'Description',
              required: true
            }
          }
        },
        formHeading: {
          type: 'text',
          label: 'Form Heading',
          required: true
        },
        formDescription: {
          type: 'textarea',
          label: 'Form Description',
          required: true
        },
        benefits: {
          type: 'list',
          label: 'Benefits',
          item_type: 'text'
        }
      }
    },

    // Footer
    footer: {
      label: 'Footer',
      fields: {
        blurb: {
          type: 'textarea',
          label: 'Company Blurb',
          required: true
        },
        email: {
          type: 'text',
          label: 'Email',
          required: true
        },
        phone: {
          type: 'text',
          label: 'Phone',
          required: true
        },
        location: {
          type: 'text',
          label: 'Location',
          required: true
        },
        services: {
          type: 'list',
          label: 'Services',
          item_type: 'text'
        }
      }
    }
  },

  // Git configuration
  git: {
    branch: 'main',
    commitMessage: 'Update content via PagesCMS'
  },

  // Build configuration
  build: {
    command: 'npm run build',
    output: 'dist'
  }
};