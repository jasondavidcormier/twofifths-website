# Two Fifths Website

## Deployment Setup

This project is configured for automatic deployment to Netlify via GitHub Actions.

### How it Works

1. **Bolt → GitHub**: When you deploy from Bolt, changes are pushed to GitHub
2. **GitHub → Netlify**: GitHub Actions automatically builds and deploys to Netlify
3. **CMS → GitHub**: The CMS writes content changes directly to GitHub
4. **Auto-Deploy**: Any changes to the main branch trigger automatic deployment

### Setup Steps

#### 1. Connect Bolt to GitHub
- In Bolt, go to deployment settings
- Choose "Deploy to GitHub"
- Connect your GitHub account
- Select or create repository: `twofifths-website`

#### 2. Configure Netlify Secrets
In your GitHub repository settings, add these secrets:

- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID

#### 3. Update CMS Configuration
Update the CMS to use your GitHub repository:
- Repository: `YOUR_USERNAME/twofifths-website`
- Branch: `main`
- File path: `src/utils/contentManager.ts`

### Workflow

1. **Development**: Use Bolt for complex changes
2. **Content**: Use CMS for content updates
3. **Deployment**: Both automatically deploy via GitHub Actions
4. **Live Site**: Changes appear on Netlify within 1-2 minutes

### File Structure
```
├── .github/workflows/deploy.yml  # Auto-deployment configuration
├── src/
│   ├── utils/contentManager.ts   # Content that CMS updates
│   └── ...                       # Other source files
├── admin-panel-x7k9/            # CMS files
└── dist/                        # Built files (auto-generated)
```

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Build and prepare for deployment

### Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs
- Verify Netlify secrets are set correctly
- Ensure build command succeeds locally

**CMS not updating:**
- Check GitHub token permissions
- Verify repository and file paths
- Check CMS authentication status

**Content not appearing:**
- Wait 1-2 minutes for deployment
- Check Netlify deployment logs
- Verify content format is correct