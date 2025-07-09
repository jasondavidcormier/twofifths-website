# Two-Fifths Website Content Editing Guide

This guide will show you how to update your website content directly through GitHub. Once you make changes and "commit" them, your website will automatically update within 1-2 minutes.

## Getting Started with GitHub

### What is GitHub?
GitHub is like Google Drive for code. It stores all your website files and tracks changes. When you edit a file and save it (called "committing"), your website automatically rebuilds with the new content.

### Accessing Your Files
1. Go to your GitHub repository (the folder containing all your website files)
2. You'll see a list of folders and files
3. Click on any file to view it
4. Click the pencil icon (✏️) in the top right to edit it

### Making Changes
1. Edit the content directly in the browser
2. Scroll to the bottom when done
3. Add a brief description of what you changed (e.g., "Updated hero headline")
4. Click "Commit changes" (green button)
5. Wait 1-2 minutes for your website to update

---

## 1. General Content Edits

**File to edit:** `src/utils/contentManager.ts`

### Finding the Content
1. Navigate to `src` folder → `utils` folder → `contentManager.ts`
2. Click the pencil icon to edit
3. Look for the `defaultContent` section (around line 80)

### Common Content Areas

#### Hero Section (Top of homepage)
```javascript
hero: {
  headline: 'Fractional Partnership Leadership on Demand',
  subheadline: 'Get access to a veteran partnership leader now, without the burden of a full-time hire.',
  ctaText: 'Browse Service Packages'
},
```

**To change:**
- Replace text between the quotes
- Keep the quotes and commas exactly as they are

#### About Section
```javascript
about: {
  mainHeading: 'Why Two-Fifths?',
  tagline: 'Revenue is a result, not a goal...',
  description: 'Growth doesn\'t happen in a vacuum...',
  profileHeading: 'Two-Fifths is Jason Cormier',
  profileSubtitle: 'Founder & Senior Partnership Strategist',
  profilePoints: [
    'Two decades building and scaling partner programs...',
    'Early pioneer for API platforms...',
    'Authored standardised digital transformation...',
    'Shopify alumnus with insider insights...'
  ]
},
```

**To change profile points:**
- Each point is surrounded by quotes and separated by commas
- Add new points by copying the format: `'Your new point here',`
- Remove points by deleting the entire line including the comma

#### Contact Information
```javascript
contact: {
  email: 'jason@twofifthsfractional.com',
  phone: '+61 423 161 718',
  location: 'Melbourne, Australia'
},
```

#### Next Steps Section
```javascript
nextSteps: {
  heading: 'Next Steps',
  description: 'Still unsure where to start?...',
  formHeading: 'Let\'s Connect',
  formDescription: 'Share your business overview...'
},
```

### Important Rules:
- Always keep quotes around text
- Keep commas at the end of lines
- Don't delete the structure (the words before the colons)
- If you see `\'` in text, that's an escaped apostrophe - leave it as is

---

## 2. Adding/Editing Testimonials

**File to edit:** `src/utils/contentManager.ts`

### Finding Testimonials
1. In `contentManager.ts`, find the `testimonials:` section (around line 150)
2. You'll see an array of testimonial objects

### Testimonial Format
```javascript
{
  name: 'Rob Hango-Zada',
  title: 'Co-Founder and Co-CEO',
  company: 'Shippit',
  quote: 'Jason is a natural relationship builder...'
},
```

### Adding a New Testimonial
1. Find the end of the testimonials list (look for the closing `]`)
2. Before the `]`, add a comma after the last testimonial
3. Add your new testimonial:

```javascript
{
  name: 'Your Contact Name',
  title: 'Their Job Title',
  company: 'Company Name',
  quote: 'The testimonial text goes here...'
},
```

### Adding Company Logo Icons

**Step 1: Upload the Logo**
1. Go to the `public/testimonialicons/` folder
2. Click "Add file" → "Upload files"
3. Upload your company logo (PNG or JPG format)
4. Name it something simple like `companyname.png`
5. Commit the upload

**Step 2: Update the Icon Mapping**
1. Go to `src/components/TestimonialCarousel.tsx`
2. Find the `getCompanyIcon` function (around line 15)
3. Add a new line following this pattern:

```javascript
if (companyLower.includes('your company name')) return '/testimonialicons/yourfile.png';
```

**Example:**
```javascript
if (companyLower.includes('microsoft')) return '/testimonialicons/microsoft.png';
```

### Removing a Testimonial
1. Find the testimonial you want to remove
2. Delete everything from the opening `{` to the closing `},`
3. Make sure there's still a comma after the previous testimonial

---

## 3. Changing Logo Strip

**File to edit:** `src/components/LogoStrip.tsx`

### Finding the Logo Strip
1. Navigate to `src` → `components` → `LogoStrip.tsx`
2. Look for the section with multiple `<img` tags (around line 15)

### Logo Format
```javascript
<img 
  src="/1280px-Shopify_logo_2018.svg.webp" 
  alt="Shopify" 
  className="h-8 md:h-10 object-contain hover:scale-110 transition-all duration-300"
/>
```

### Adding a New Logo
1. Upload your logo file to the `public/` folder (same process as testimonial icons)
2. Copy an existing `<img` block
3. Change the `src="/your-logo-filename.png"`
4. Change the `alt="Your Company Name"`

### Removing a Logo
1. Find the `<img` block you want to remove
2. Delete everything from `<img` to the closing `/>`

### Changing Logo Order
- Cut and paste entire `<img` blocks to reorder them
- The order in the code is the order they appear on the website

---

## 4. Hide/Show Playbook Waitlist Module

**File to edit:** `src/components/ServicePackages.tsx`

### Finding the Playbook Section
1. Navigate to `src` → `components` → `ServicePackages.tsx`
2. Look for the section that starts with `{audience === 'international' && (` (around line 120)

### To Hide the Playbook Module
1. Find this line: `{audience === 'international' && (`
2. Change it to: `{false && (`

### To Show the Playbook Module
1. Find the line that says: `{false && (`
2. Change it back to: `{audience === 'international' && (`

### Editing Playbook Content
Within the playbook section, you can edit:
- The heading text
- The description text
- The button text

Look for text between quotes and edit as needed.

---

## Service Package Content

**File to edit:** `src/utils/contentManager.ts`

### Finding Service Packages
1. Look for `servicePackages:` section (around line 300)
2. You'll see `australian:` and `international:` sections

### Package Format
```javascript
{
  title: 'Fractional Partnership Architect',
  subtitle: '2-3 days/week',
  description: 'Your strategic growth partner...',
  features: [
    'Strategy & execution aligned to your organisational goals',
    'Partner recruitment, onboarding, and enablement',
    'Cross-functional team alignment and collaboration',
    'Data-driven optimisation and performance monitoring'
  ],
  ideal: 'Perfect for ambitious SaaS companies...'
}
```

### Editing Packages
- Change any text between quotes
- Add/remove features following the same format
- Keep the structure intact

---

## Common Mistakes to Avoid

1. **Don't remove quotes** - All text content must be in quotes
2. **Don't remove commas** - They separate items in lists
3. **Don't change structure words** - Words like `hero:`, `title:`, `description:` should stay
4. **Watch your brackets** - `{`, `}`, `[`, `]` must stay balanced
5. **Test small changes first** - Make one small edit to see how it works

## Getting Help

If something breaks:
1. Check the GitHub "Actions" tab to see if there are any error messages
2. Look at your recent commits and try to identify what changed
3. You can always revert to a previous version using GitHub's history

## File Structure Quick Reference

```
src/
├── components/
│   ├── LogoStrip.tsx (logo strip)
│   ├── ServicePackages.tsx (playbook module)
│   └── TestimonialCarousel.tsx (testimonial icons)
└── utils/
    └── contentManager.ts (main content)

public/
├── testimonialicons/ (testimonial company logos)
└── (main logo files)
```

Remember: After any change, commit with a clear message and wait 1-2 minutes for the website to update!