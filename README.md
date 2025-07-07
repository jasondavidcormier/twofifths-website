# Two Fifths Website

A modern, responsive website for Two Fifths Fractional Partnership Leadership.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Optimized for all device sizes
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

## Deployment

The site is configured for automatic deployment to Netlify. Push to the main branch to trigger a deployment.

## Content Updates

Content is managed through the static content system in `src/utils/contentManager.ts`. To update content:

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
└── main.tsx           # Application entry point
```

## Contact

For questions or support, contact jason@twofifthsfractional.com