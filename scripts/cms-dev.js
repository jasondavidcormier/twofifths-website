#!/usr/bin/env node

/**
 * Development script for Two Fifths CMS
 * Provides utilities for CMS development and testing
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCMSSetup() {
  log('\n🔍 Checking CMS Setup...', 'blue');
  
  const requiredFiles = [
    'pages.config.js',
    'public/admin/index.html',
    'src/utils/contentManager.ts',
    'CMS_GUIDE.md'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} - Missing!`, 'red');
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    log('\n✅ CMS setup is complete!', 'green');
    log('🚀 Run "npm run cms" to start the CMS', 'cyan');
  } else {
    log('\n❌ CMS setup is incomplete!', 'red');
    log('Please ensure all required files are present.', 'yellow');
  }
  
  return allFilesExist;
}

function validateContent() {
  log('\n🔍 Validating Content Structure...', 'blue');
  
  try {
    const contentPath = 'src/utils/contentManager.ts';
    const content = fs.readFileSync(contentPath, 'utf8');
    
    // Check for required sections
    const requiredSections = [
      'hero',
      'about',
      'audienceSelector',
      'testimonials',
      'nextSteps',
      'footer',
      'servicePackages'
    ];
    
    let validStructure = true;
    
    requiredSections.forEach(section => {
      if (content.includes(`${section}:`)) {
        log(`✅ ${section} section found`, 'green');
      } else {
        log(`❌ ${section} section missing`, 'red');
        validStructure = false;
      }
    });
    
    // Check for CMS data attributes in components
    const componentFiles = [
      'src/components/Hero.tsx',
      'src/components/About.tsx',
      'src/components/AudienceSelector.tsx',
      'src/components/TestimonialCarousel.tsx',
      'src/components/NextSteps.tsx',
      'src/components/Contact.tsx',
      'src/components/ServicePackages.tsx'
    ];
    
    log('\n🔍 Checking CMS data attributes...', 'blue');
    
    componentFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const componentContent = fs.readFileSync(file, 'utf8');
        if (componentContent.includes('data-cms-field')) {
          log(`✅ ${path.basename(file)} has CMS attributes`, 'green');
        } else {
          log(`⚠️  ${path.basename(file)} missing CMS attributes`, 'yellow');
        }
      }
    });
    
    if (validStructure) {
      log('\n✅ Content structure is valid!', 'green');
    } else {
      log('\n❌ Content structure has issues!', 'red');
    }
    
    return validStructure;
    
  } catch (error) {
    log(`❌ Error validating content: ${error.message}`, 'red');
    return false;
  }
}

function showCMSInfo() {
  log('\n📋 Two Fifths CMS Information', 'cyan');
  log('================================', 'cyan');
  log('CMS Type: PagesCMS');
  log('Admin URL: http://localhost:5173/admin/');
  log('Config File: pages.config.js');
  log('Content File: src/utils/contentManager.ts');
  log('Documentation: CMS_GUIDE.md');
  log('\n📝 Available Commands:', 'yellow');
  log('npm run cms        - Start CMS in development mode');
  log('npm run cms:build  - Build CMS for production');
  log('npm run dev        - Start development server');
  log('npm run build      - Build for production');
}

function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      checkCMSSetup();
      break;
    case 'validate':
      validateContent();
      break;
    case 'info':
      showCMSInfo();
      break;
    default:
      log('🚀 Two Fifths CMS Development Tool', 'cyan');
      log('\nAvailable commands:', 'yellow');
      log('node scripts/cms-dev.js check     - Check CMS setup');
      log('node scripts/cms-dev.js validate  - Validate content structure');
      log('node scripts/cms-dev.js info      - Show CMS information');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkCMSSetup,
  validateContent,
  showCMSInfo
};