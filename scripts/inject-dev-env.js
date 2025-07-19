#!/usr/bin/env node

/**
 * Development build script that injects environment variables securely
 * This script reads from .env file and injects safe variables into index.html
 * Only runs during local development (ng serve)
 */

const fs = require('fs');
const path = require('path');

// Read .env file if it exists
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('No .env file found, skipping environment injection');
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

// Inject environment variables into index.html for development
function injectDevEnvironment() {
  const env = loadEnvFile();
  const indexPath = path.join(__dirname, '../src/index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found');
    return;
  }

  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Remove any existing injection
  indexContent = indexContent.replace(/<!-- DEV_ENV_INJECTION_START -->[\s\S]*?<!-- DEV_ENV_INJECTION_END -->/g, '');
  
  // Create injection script
  const script = `
    <!-- DEV_ENV_INJECTION_START -->
    <script>
      // Development environment injection
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.__GOOGLE_MAPS_API_KEY__ = '${env.API_KEY_GMAPS || ''}';
        window.__APP_ENV__ = {
          production: false,
          version: '1.0.0'
        };
        console.log('Development environment variables loaded');
      }
    </script>
    <!-- DEV_ENV_INJECTION_END -->`;

  // Inject before </head>
  indexContent = indexContent.replace('</head>', `${script}\n  </head>`);
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('Development environment variables injected into index.html');
}

// Only run if called directly (not imported)
if (require.main === module) {
  injectDevEnvironment();
}

module.exports = { injectDevEnvironment };
