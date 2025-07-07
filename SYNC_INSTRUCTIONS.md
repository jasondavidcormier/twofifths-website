# CMS Sync Instructions

## Overview
This document explains how to keep your Bolt project synchronized with changes made in the CMS.

## Export Methods from CMS

The CMS provides two export options:

### 1. Export JSON (Complete Data)
- **File:** `two-fifths-cms-export-YYYY-MM-DD.json`
- **Contains:** Complete content data with metadata
- **Use for:** Backup, sharing, or programmatic processing

### 2. Export for Bolt (Instructions)
- **File:** `bolt-update-instructions-YYYY-MM-DD.txt`
- **Contains:** Step-by-step instructions with code snippets
- **Use for:** Manual updates to Bolt project

## How to Sync Changes

### Method 1: Using Export for Bolt (Recommended)

1. **In CMS:**
   - Make your content changes
   - Click "Export for Bolt" button
   - Download the instructions file

2. **In Bolt:**
   - Open the downloaded `.txt` file
   - Copy the `defaultContent` object from the instructions
   - Paste it into `src/utils/contentManager.ts`
   - Replace the existing `defaultContent` object
   - Save the file

3. **Verify:**
   - Changes should appear immediately on your site
   - Check all sections to ensure content updated correctly

### Method 2: Using JSON Export

1. **In CMS:**
   - Make your content changes
   - Click "Export JSON" button
   - Download the JSON file

2. **In Bolt:**
   - Open the JSON file
   - Copy the `content` object
   - Paste it as the new `defaultContent` in `src/utils/contentManager.ts`
   - Save the file

## What Gets Exported

The export includes all editable content:

- **Hero Section:** Headline, subheadline, CTA text
- **About Section:** Headings, tagline, description, profile info
- **Audience Selector:** Headings and descriptions for both audiences
- **Testimonials:** All testimonials with names, titles, and quotes
- **Next Steps:** Section headings and form descriptions
- **Contact Info:** Email, phone, location

## File Locations to Update

When syncing changes, you'll primarily update:

```
src/utils/contentManager.ts  (Main content file)
```

The content system automatically updates these components:
- `src/components/Hero.tsx`
- `src/components/About.tsx`
- `src/components/AudienceSelector.tsx`
- `src/components/TestimonialCarousel.tsx`
- `src/components/NextSteps.tsx`
- `src/components/Contact.tsx`

## Validation Checklist

After importing changes, verify:

- [ ] Hero section displays new content
- [ ] About section shows updated information
- [ ] Audience selector has correct descriptions
- [ ] All testimonials appear (check count)
- [ ] Next steps section updated
- [ ] Contact information is correct
- [ ] No layout or styling issues
- [ ] Site loads without errors

## Troubleshooting

### Content Not Updating
1. Check that you updated `src/utils/contentManager.ts`
2. Ensure you replaced the entire `defaultContent` object
3. Save the file and refresh your browser
4. Check browser console for errors

### Import Errors in CMS
1. Ensure you're importing a valid JSON file
2. Check that the file wasn't corrupted during download
3. Try exporting and re-importing to test

### Formatting Issues
1. Verify all quotes and special characters are properly escaped
2. Check that testimonials don't have excessive line breaks
3. Ensure contact information doesn't contain invalid characters

## Best Practices

### Regular Sync Workflow
1. **Edit in CMS:** Make all content changes in the CMS interface
2. **Export:** Use "Export for Bolt" for easy copy-paste instructions
3. **Update Bolt:** Copy the content object to `contentManager.ts`
4. **Test:** Verify all changes appear correctly
5. **Deploy:** Push changes to production

### Backup Strategy
- Export JSON files regularly as backups
- Keep dated exports for version history
- Test import functionality periodically
- Store exports in a secure location

### Team Coordination
- Communicate when making major content changes
- Use the export timestamp to track when changes were made
- Coordinate deployments to avoid conflicts
- Keep a log of major content updates

## Advanced Usage

### Programmatic Updates
The JSON export format allows for programmatic processing:

```javascript
// Example: Process exported data
const exportData = JSON.parse(exportedJson);
const content = exportData.content;

// Access specific sections
console.log(content.hero.headline);
console.log(content.testimonials.length);
```

### Batch Operations
You can modify the exported JSON before importing:

1. Export JSON from CMS
2. Edit the JSON file programmatically
3. Import the modified JSON back to CMS
4. Deploy changes

### Version Control
Consider tracking content changes in version control:

1. Export JSON after major changes
2. Commit the JSON file to your repository
3. Use git history to track content evolution
4. Restore previous versions if needed

## Support

If you encounter issues with the sync process:

1. Check this documentation first
2. Verify file formats and content structure
3. Test with a small content change
4. Contact technical support with:
   - Export files
   - Error messages
   - Steps to reproduce the issue

---

*This sync system ensures your Bolt project stays up-to-date with CMS changes while maintaining full control over your content.*