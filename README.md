# Two Fifths Website

A modern, responsive website for Two Fifths Fractional Partnership Leadership.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Optimized for all device sizes
- **Content Management**: Built-in CMS for easy content updates
- **Service Packages**: Tailored solutions for Australian and International SaaS companies
- **Testimonials**: Dynamic testimonial carousel
- **Contact Forms**: Integrated with Google Sheets for lead capture
- **Performance**: Fast loading with optimized assets

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Lucide React** for icons
- **Netlify** for deployment

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Management System (CMS)

This website includes a built-in CMS powered by PagesCMS for easy content updates.

### Quick Start
```bash
# Start CMS
npm run cms

# Access at: http://localhost:5173/admin/
```

### CMS Features
- Edit all website content through a web interface
- Real-time preview of changes
- Automatic content validation
- No technical knowledge required

### CMS Commands
```bash
npm run cms          # Start CMS in development
npm run cms:build    # Build CMS for production
npm run cms:check    # Verify CMS setup
npm run cms:validate # Validate content structure
npm run cms:info     # Show CMS information
```

### Documentation
- **Quick Start**: See `CMS_QUICKSTART.md`
- **Full Guide**: See `CMS_GUIDE.md`

## Deployment

The site is configured for automatic deployment to Netlify. Push to the main branch to trigger a deployment.

## Content Updates

### Option 1: Use the CMS (Recommended)
1. Run `npm run cms`
2. Open `http://localhost:5173/admin/`
3. Edit content through the web interface
4. Publish changes

### Option 2: Edit Code Directly
1. Edit the `defaultContent` object in `src/utils/contentManager.ts`
2. Save the file
3. Changes will appear immediately in development
4. Deploy to production to make changes live

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and content management
├── App.tsx             # Main application component
└── main.tsx            # Application entry point

public/admin/           # CMS admin interface
pages.config.js         # CMS configuration
CMS_GUIDE.md           # CMS documentation
CMS_QUICKSTART.md      # CMS quick start guide
```

## Contact

For questions or support, contact jason@twofifthsfractional.com