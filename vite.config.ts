import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-cms',
      writeBundle() {
        // Create cms directory in dist
        mkdirSync('dist/admin-panel-x7k9', { recursive: true });
        
        // List of files to copy from admin-panel-x7k9 to dist/admin-panel-x7k9
        const filesToCopy = [
          'index.html',
          'cms-app.js',
          'README.md',
          'test-auth.html',      // Step 4a test page
          'cms-app-basic.js',    // Step 4a basic auth component
          'test-google-drive.html', // Google Drive authentication test
          'test-results.md',     // Test results documentation
          'SYNC_INSTRUCTIONS.md', // Sync instructions (if it exists in admin-panel)
          'test-simplified-auth.html' // Simplified authentication test
        ];
        
        // Copy each file if it exists
        filesToCopy.forEach(fileName => {
          const sourcePath = `admin-panel-x7k9/${fileName}`;
          const destPath = `dist/admin-panel-x7k9/${fileName}`;
          
          if (existsSync(sourcePath)) {
            copyFileSync(sourcePath, destPath);
            console.log(`✅ Copied ${fileName} to dist`);
          } else {
            console.warn(`⚠️ File not found: ${sourcePath}`);
          }
        });
        
        console.log('🚀 CMS files copied to dist/admin-panel-x7k9/');
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});