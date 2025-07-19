#!/usr/bin/env node

/**
 * Clean development environment injection from index.html
 * This ensures no API keys are committed to the repository
 */

const fs = require('fs');
const path = require('path');

function cleanDevEnvironment() {
  const indexPath = path.join(__dirname, '../src/index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found');
    return;
  }

  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Remove any existing injection
  const originalContent = indexContent;
  indexContent = indexContent.replace(/<!-- DEV_ENV_INJECTION_START -->[\s\S]*?<!-- DEV_ENV_INJECTION_END -->\n/g, '');
  
  if (originalContent !== indexContent) {
    fs.writeFileSync(indexPath, indexContent);
    console.log('Development environment variables cleaned from index.html');
  } else {
    console.log('No development environment variables found in index.html');
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  cleanDevEnvironment();
}

module.exports = { cleanDevEnvironment };
