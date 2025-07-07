# Two Fifths CMS - Content Management System

## Overview
This is a standalone Content Management System (CMS) for the Two Fifths website. It allows you to easily update website content and deploy changes directly to the live site.

## Features

### Content Management
- **Hero Section**: Update main headline, subheadline, and call-to-action text
- **About Section**: Modify headings, taglines, descriptions, and profile information
- **Audience Selector**: Edit content for both Australian and International audience options
- **Testimonials**: Add, edit, and remove client testimonials with word count tracking
- **Next Steps**: Update section headings and form descriptions
- **Contact Information**: Modify email, phone, and location details

### Direct Deployment
- **Deploy Changes**: Push content updates directly to the live website
- **Real-time Updates**: Changes appear on the live site immediately after deployment
- **Status Tracking**: Monitor deployment progress with real-time status updates

### Data Management
- **Export JSON**: Save all content as a JSON file for backup and sharing
- **Export for Bolt**: Generate step-by-step instructions for updating the Bolt project
- **Import JSON**: Load previously saved content from JSON files
- **Auto-save**: Content is automatically saved locally as you edit
- **Project Sync**: Keep your Bolt project synchronized with CMS changes

## How to Use

### 1. Accessing the CMS
- Navigate to `/admin-panel-x7k9/` in your web browser
- Enter the password: `twofifths2024!`

### 2. Editing Content
1. Use the sidebar navigation to select the content section you want to edit
2. Make your changes in the form fields
3. Changes are automatically saved as you type

### 3. Deploying Changes
1. After making your edits, click the **"Deploy Changes"** button in the header
2. Watch the deployment status indicator for progress updates
3. Changes will be live on the website within seconds

### 4. Managing Testimonials
- **Add New**: Click "Add Testimonial" to create a new testimonial entry
- **Edit Existing**: Modify name, title, and quote fields
- **Word Count**: Monitor word count to maintain optimal length (75-125 words recommended)
- **Remove**: Delete testimonials that are no longer needed

### 5. Backup and Restore
- **Export JSON**: Click "Export JSON" to download a complete backup
- **Export for Bolt**: Click "Export for Bolt" to get update instructions for your Bolt project
- **Import**: Click "Import JSON" to restore from a JSON file
- **Regular Backups**: Export content regularly to avoid data loss

## Syncing with Bolt Project

### Export for Bolt Feature
The CMS includes a special export feature designed for Bolt project synchronization:

1. **Make Changes**: Edit content in the CMS as needed
2. **Export for Bolt**: Click the "Export for Bolt" button
3. **Download Instructions**: Save the generated `.txt` file
4. **Follow Instructions**: Open the file and follow the step-by-step guide
5. **Update Bolt**: Copy the provided code into your Bolt project

### What Gets Exported
- Complete content data with metadata
- Step-by-step update instructions
- Code snippets ready for copy-paste
- Validation checklist
- Change summary

### File Formats
- **JSON Export**: `two-fifths-cms-export-YYYY-MM-DD.json` (complete data)
- **Bolt Export**: `bolt-update-instructions-YYYY-MM-DD.txt` (instructions)

## Deployment System

### How It Works
The CMS uses a real-time deployment system that:
1. Saves your changes to browser storage
2. Communicates with the live website using browser messaging
3. Updates the live site content immediately
4. Provides status feedback throughout the process

### Deployment Status Messages
- **"Preparing deployment..."**: Initial setup
- **"Updating content..."**: Saving changes
- **"Rebuilding site..."**: Processing updates
- **"Deployment successful! ✅"**: Changes are live
- **"Deployment failed"**: Error occurred, try again

### Automatic Updates
The live website automatically checks for content updates:
- Every 30 seconds via background polling
- Immediately when receiving deployment messages
- When users navigate to the site

## Content Guidelines

### Testimonials
- **Optimal Length**: 75-125 words for maximum impact
- **Structure**: Include challenge, solution, and specific results
- **Attribution**: Always include full name and job title
- **Authenticity**: Keep quotes natural and conversational

### Headlines and Copy
- **Clarity**: Use clear, benefit-focused language
- **Consistency**: Maintain consistent tone across all sections
- **Action-Oriented**: Use active voice and compelling calls-to-action

### Contact Information
- **Accuracy**: Ensure all contact details are current and correct
- **Professional**: Use professional email addresses and phone numbers

## Technical Details

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript to be enabled
- Responsive design works on desktop and mobile devices

### Data Storage
- Content is stored locally in browser storage
- Live content updates use localStorage communication
- Export regularly to avoid losing changes

### Security
- Password-protected access to CMS
- Session-based authentication
- All content editing happens locally in your browser
- No sensitive information is transmitted without your explicit action

## Troubleshooting

### Common Issues

**Deployment not working**:
- Refresh both the CMS and main website
- Check that both are running in the same browser
- Try exporting and importing content as a backup method

**Changes not appearing on live site**:
- Wait 30 seconds for automatic update check
- Refresh the main website page
- Check deployment status for error messages

**CMS not loading**:
- Ensure JavaScript is enabled in your browser
- Clear browser cache and reload
- Check browser console for error messages

**Import/Export issues**:
- Ensure you're using a valid JSON file exported from this CMS
- Check that the file hasn't been corrupted or modified
- Try with a smaller content file to test

### Getting Help
If you encounter issues:
1. Export your current content as backup
2. Try refreshing both CMS and main site
3. Check browser console for error messages
4. Contact technical support with exported content file

## Best Practices

### Regular Workflow
1. **Edit Content**: Make your changes in the CMS
2. **Review**: Double-check all changes before deploying
3. **Deploy**: Click "Deploy Changes" and wait for confirmation
4. **Verify**: Check the live site to confirm changes appear correctly
5. **Sync**: Export for Bolt to update your project files
6. **Backup**: Export JSON after major changes

### Content Review
- Review all changes before deploying
- Check spelling and grammar carefully
- Ensure all links and contact information are correct
- Test testimonials for appropriate length and impact

### Backup Strategy
- Export JSON files after making significant changes
- Export for Bolt when syncing with your project
- Use "Export for Bolt" when updating the main project
- Keep multiple backup files with dates in the filename
- Store backups in a secure location
- Test the sync process with your Bolt project regularly
- Test import functionality periodically
- Maintain sync between CMS and Bolt project

## Security Notes

### Password Management
- Change the default password regularly
- Don't share the password via insecure channels
- Log out when finished editing

### Content Safety
- Always export content before major changes
- Test imports with backup files
- Keep local copies of important content

## File Structure
```
admin-panel-x7k9/
├── index.html          # CMS interface
├── cms-app.js         # CMS application code
├── README.md          # This documentation
└── (exports)          # Generated export files
    ├── two-fifths-cms-export-YYYY-MM-DD.json
    └── bolt-update-instructions-YYYY-MM-DD.txt
```

## Updates and Maintenance
- The CMS is designed to be self-contained and require minimal maintenance
- Use the sync system to keep your Bolt project updated
- Keep backups of your content
- Test the deployment system after any website updates
- Contact your developer if you need additional features

---

For technical support or feature requests, contact your development team with this documentation and any exported files. See `SYNC_INSTRUCTIONS.md` for detailed project synchronization guidance.