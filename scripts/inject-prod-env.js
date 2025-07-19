#!/usr/bin/env node

/**
 * Post-build script for Netlify production
 * Injects environment variables into prerendered HTML files
 * This runs after Angular build but before Netlify deployment
 */

const fs = require('fs');
const path = require('path');

function injectProductionEnvironment() {
  console.log('🔧 Injecting production environment variables...');
  
  const distPath = path.join(__dirname, '../dist/schlosswochen-ch/browser');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist folder');
    process.exit(1);
  }

  // Get environment variables from Netlify build environment
  const googleMapsApiKey = process.env.API_KEY_GMAPS || '';
  const nodeEnv = process.env.NODE_ENV || 'production';
  
  console.log('Environment check:', {
    hasGoogleMapsKey: !!googleMapsApiKey,
    googleMapsKeyLength: googleMapsApiKey.length,
    nodeEnv: nodeEnv
  });

  if (!googleMapsApiKey) {
    console.warn('⚠️ No Google Maps API key found in environment variables');
  }

  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Create injection script for production
  const script = `
    <script>
      // Production environment injection
      window.__GOOGLE_MAPS_API_KEY__ = '${googleMapsApiKey}';
      window.__APP_ENV__ = {
        production: ${nodeEnv === 'production'},
        version: '1.0.0'
      };
      console.log('Production environment variables loaded');
    </script>`;

  // Inject before </head>
  if (!indexContent.includes('window.__GOOGLE_MAPS_API_KEY__')) {
    indexContent = indexContent.replace('</head>', `${script}\n  </head>`);
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Production environment variables injected into index.html');
  } else {
    console.log('ℹ️ Environment variables already present in index.html');
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  injectProductionEnvironment();
}

module.exports = { injectProductionEnvironment };
