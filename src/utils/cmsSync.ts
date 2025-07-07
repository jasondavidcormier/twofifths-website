// CMS Synchronization utilities for importing/exporting content changes
import { ContentData } from './contentManager';

export interface CMSExportData {
  content: ContentData;
  timestamp: number;
  version: string;
  metadata: {
    exportedBy: string;
    exportedAt: string;
    totalSections: number;
    totalTestimonials: number;
  };
}

export interface ComponentUpdate {
  filePath: string;
  updateType: 'content' | 'structure';
  changes: Array<{
    section: string;
    field: string;
    oldValue: string;
    newValue: string;
    lineNumber?: number;
  }>;
}

export class CMSSync {
  private static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Generate a complete export of all CMS content and changes
   */
  static generateFullExport(content: ContentData): CMSExportData {
    return {
      content,
      timestamp: Date.now(),
      version: this.CURRENT_VERSION,
      metadata: {
        exportedBy: 'Two Fifths CMS',
        exportedAt: new Date().toISOString(),
        totalSections: Object.keys(content).length,
        totalTestimonials: content.testimonials.length
      }
    };
  }

  /**
   * Generate component updates for Bolt project synchronization
   */
  static generateComponentUpdates(newContent: ContentData, originalContent?: ContentData): ComponentUpdate[] {
    const updates: ComponentUpdate[] = [];

    // Hero component updates
    if (!originalContent || this.hasContentChanged(newContent.hero, originalContent.hero)) {
      updates.push({
        filePath: 'src/components/Hero.tsx',
        updateType: 'content',
        changes: [
          {
            section: 'hero',
            field: 'headline',
            oldValue: originalContent?.hero.headline || '',
            newValue: newContent.hero.headline
          },
          {
            section: 'hero',
            field: 'subheadline',
            oldValue: originalContent?.hero.subheadline || '',
            newValue: newContent.hero.subheadline
          },
          {
            section: 'hero',
            field: 'ctaText',
            oldValue: originalContent?.hero.ctaText || '',
            newValue: newContent.hero.ctaText
          }
        ]
      });
    }

    // About component updates
    if (!originalContent || this.hasContentChanged(newContent.about, originalContent.about)) {
      updates.push({
        filePath: 'src/components/About.tsx',
        updateType: 'content',
        changes: [
          {
            section: 'about',
            field: 'mainHeading',
            oldValue: originalContent?.about.mainHeading || '',
            newValue: newContent.about.mainHeading
          },
          {
            section: 'about',
            field: 'tagline',
            oldValue: originalContent?.about.tagline || '',
            newValue: newContent.about.tagline
          },
          {
            section: 'about',
            field: 'description',
            oldValue: originalContent?.about.description || '',
            newValue: newContent.about.description
          },
          {
            section: 'about',
            field: 'profileHeading',
            oldValue: originalContent?.about.profileHeading || '',
            newValue: newContent.about.profileHeading
          },
          {
            section: 'about',
            field: 'profileSubtitle',
            oldValue: originalContent?.about.profileSubtitle || '',
            newValue: newContent.about.profileSubtitle
          }
        ]
      });
    }

    // Audience Selector updates
    if (!originalContent || this.hasContentChanged(newContent.audienceSelector, originalContent.audienceSelector)) {
      updates.push({
        filePath: 'src/components/AudienceSelector.tsx',
        updateType: 'content',
        changes: [
          {
            section: 'audienceSelector',
            field: 'heading',
            oldValue: originalContent?.audienceSelector.heading || '',
            newValue: newContent.audienceSelector.heading
          },
          {
            section: 'audienceSelector',
            field: 'description',
            oldValue: originalContent?.audienceSelector.description || '',
            newValue: newContent.audienceSelector.description
          }
        ]
      });
    }

    // Testimonials updates
    if (!originalContent || this.hasContentChanged(newContent.testimonials, originalContent.testimonials)) {
      updates.push({
        filePath: 'src/components/TestimonialCarousel.tsx',
        updateType: 'content',
        changes: [{
          section: 'testimonials',
          field: 'testimonials',
          oldValue: JSON.stringify(originalContent?.testimonials || []),
          newValue: JSON.stringify(newContent.testimonials)
        }]
      });
    }

    // Next Steps updates
    if (!originalContent || this.hasContentChanged(newContent.nextSteps, originalContent.nextSteps)) {
      updates.push({
        filePath: 'src/components/NextSteps.tsx',
        updateType: 'content',
        changes: [
          {
            section: 'nextSteps',
            field: 'heading',
            oldValue: originalContent?.nextSteps.heading || '',
            newValue: newContent.nextSteps.heading
          },
          {
            section: 'nextSteps',
            field: 'description',
            oldValue: originalContent?.nextSteps.description || '',
            newValue: newContent.nextSteps.description
          },
          {
            section: 'nextSteps',
            field: 'formHeading',
            oldValue: originalContent?.nextSteps.formHeading || '',
            newValue: newContent.nextSteps.formHeading
          },
          {
            section: 'nextSteps',
            field: 'formDescription',
            oldValue: originalContent?.nextSteps.formDescription || '',
            newValue: newContent.nextSteps.formDescription
          }
        ]
      });
    }

    // Contact updates
    if (!originalContent || this.hasContentChanged(newContent.contact, originalContent.contact)) {
      updates.push({
        filePath: 'src/components/Contact.tsx',
        updateType: 'content',
        changes: [
          {
            section: 'contact',
            field: 'email',
            oldValue: originalContent?.contact.email || '',
            newValue: newContent.contact.email
          },
          {
            section: 'contact',
            field: 'phone',
            oldValue: originalContent?.contact.phone || '',
            newValue: newContent.contact.phone
          },
          {
            section: 'contact',
            field: 'location',
            oldValue: originalContent?.contact.location || '',
            newValue: newContent.contact.location
          }
        ]
      });
    }

    return updates;
  }

  /**
   * Generate Bolt-compatible update instructions
   */
  static generateBoltInstructions(exportData: CMSExportData): string {
    const { content } = exportData;
    
    let instructions = `# CMS Content Update Instructions

## Overview
This export contains all content changes made in the CMS. Use these instructions to update the Bolt project.

**Export Date:** ${exportData.metadata.exportedAt}
**Total Sections:** ${exportData.metadata.totalSections}
**Total Testimonials:** ${exportData.metadata.totalTestimonials}

## Content Updates

### 1. Update Default Content in contentManager.ts

Replace the \`defaultContent\` object in \`src/utils/contentManager.ts\` with:

\`\`\`typescript
export const defaultContent: ContentData = ${JSON.stringify(content, null, 2)};
\`\`\`

### 2. Component-Specific Updates

`;

    // Hero Section
    instructions += `#### Hero Section (\`src/components/Hero.tsx\`)
- **Headline:** "${content.hero.headline}"
- **Subheadline:** "${content.hero.subheadline}"
- **CTA Text:** "${content.hero.ctaText}"

`;

    // About Section
    instructions += `#### About Section (\`src/components/About.tsx\`)
- **Main Heading:** "${content.about.mainHeading}"
- **Tagline:** "${content.about.tagline}"
- **Description:** "${content.about.description}"
- **Profile Heading:** "${content.about.profileHeading}"
- **Profile Subtitle:** "${content.about.profileSubtitle}"
- **Profile Points:** ${content.about.profilePoints.length} items

`;

    // Audience Selector
    instructions += `#### Audience Selector (\`src/components/AudienceSelector.tsx\`)
- **Heading:** "${content.audienceSelector.heading}"
- **Description:** "${content.audienceSelector.description}"
- **Australian Title:** "${content.audienceSelector.australian.title}"
- **International Title:** "${content.audienceSelector.international.title}"

`;

    // Testimonials
    instructions += `#### Testimonials (\`src/components/TestimonialCarousel.tsx\`)
- **Total Testimonials:** ${content.testimonials.length}

`;

    content.testimonials.forEach((testimonial, index) => {
      instructions += `**Testimonial ${index + 1}:**
- Name: ${testimonial.name}
- Title: ${testimonial.title}
- Quote: "${testimonial.quote}"

`;
    });

    // Next Steps
    instructions += `#### Next Steps (\`src/components/NextSteps.tsx\`)
- **Heading:** "${content.nextSteps.heading}"
- **Description:** "${content.nextSteps.description}"
- **Form Heading:** "${content.nextSteps.formHeading}"
- **Form Description:** "${content.nextSteps.formDescription}"

`;

    // Contact
    instructions += `#### Contact (\`src/components/Contact.tsx\`)
- **Email:** ${content.contact.email}
- **Phone:** ${content.contact.phone}
- **Location:** ${content.contact.location}

`;

    instructions += `## Implementation Steps

1. **Update Content Manager:** Replace the \`defaultContent\` object as shown above
2. **Test Locally:** Run \`npm run dev\` to test changes
3. **Deploy:** Run deployment to push changes live
4. **Verify:** Check that all content appears correctly on the live site

## Validation Checklist

- [ ] All headlines and text content updated
- [ ] Testimonials display correctly (${content.testimonials.length} total)
- [ ] Contact information is accurate
- [ ] All sections render properly
- [ ] No broken layouts or styling issues

---

*Generated by Two Fifths CMS on ${exportData.metadata.exportedAt}*
`;

    return instructions;
  }

  /**
   * Generate a JSON file for easy import into Bolt
   */
  static generateBoltImportFile(exportData: CMSExportData): string {
    return JSON.stringify({
      type: 'twofifths-cms-export',
      version: exportData.version,
      timestamp: exportData.timestamp,
      content: exportData.content,
      instructions: this.generateBoltInstructions(exportData),
      metadata: exportData.metadata
    }, null, 2);
  }

  /**
   * Validate imported content
   */
  static validateImportedContent(data: any): data is CMSExportData {
    if (!data || typeof data !== 'object') return false;
    if (!data.content || !data.timestamp || !data.version) return false;
    
    const content = data.content;
    
    // Validate required sections
    if (!content.hero || !content.about || !content.audienceSelector) return false;
    if (!content.testimonials || !content.nextSteps || !content.contact) return false;
    
    // Validate hero section
    if (!content.hero.headline || !content.hero.subheadline || !content.hero.ctaText) return false;
    
    // Validate testimonials
    if (!Array.isArray(content.testimonials)) return false;
    
    return true;
  }

  /**
   * Check if content has changed between two objects
   */
  private static hasContentChanged(newContent: any, oldContent: any): boolean {
    return JSON.stringify(newContent) !== JSON.stringify(oldContent);
  }

  /**
   * Generate a summary of changes
   */
  static generateChangeSummary(newContent: ContentData, originalContent: ContentData): string {
    const changes: string[] = [];

    // Check each section for changes
    if (this.hasContentChanged(newContent.hero, originalContent.hero)) {
      changes.push('Hero Section');
    }
    if (this.hasContentChanged(newContent.about, originalContent.about)) {
      changes.push('About Section');
    }
    if (this.hasContentChanged(newContent.audienceSelector, originalContent.audienceSelector)) {
      changes.push('Audience Selector');
    }
    if (this.hasContentChanged(newContent.testimonials, originalContent.testimonials)) {
      changes.push(`Testimonials (${newContent.testimonials.length} total)`);
    }
    if (this.hasContentChanged(newContent.nextSteps, originalContent.nextSteps)) {
      changes.push('Next Steps');
    }
    if (this.hasContentChanged(newContent.contact, originalContent.contact)) {
      changes.push('Contact Information');
    }

    if (changes.length === 0) {
      return 'No changes detected';
    }

    return `Changes detected in: ${changes.join(', ')}`;
  }
}