const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TS/TSX files
const files = glob.sync('src/**/*.ts*', { cwd: process.cwd() });

let updated = 0;
let errors = 0;

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;

  // Skip node_modules and the api config itself
  if (file.includes('node_modules') || file.includes('config/api.ts')) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Skip if already using API_ENDPOINTS
  if (content.includes('API_ENDPOINTS')) return;

  // Replace 'http://localhost:3000/api with API_ENDPOINTS.
  // Pattern 1: fetch('http://localhost:3000/api/...
  if (content.includes("'http://localhost:3000/api")) {
    content = content.replace(/'http:\/\/localhost:3000\/api/g, "API_ENDPOINTS.");
    modified = true;
  }

  // Pattern 2: fetch(`http://localhost:3000/api/...
  if (content.includes('`http://localhost:3000/api')) {
    content = content.replace(/`http:\/\/localhost:3000\/api/g, "` + API_ENDPOINTS.");
    modified = true;
  }

  // Pattern 3: axios.get('http://localhost:3000/api/...
  if (content.includes("'http://localhost:3000/api")) {
    content = content.replace(/axios\.get\('http:\/\/localhost:3000\/api/g, "axios.get(API_ENDPOINTS.");
    content = content.replace(/axios\.post\('http:\/\/localhost:3000\/api/g, "axios.post(API_ENDPOINTS.");
    content = content.replace(/axios\.delete\('http:\/\/localhost:3000\/api/g, "axios.delete(API_ENDPOINTS.");
    modified = true;
  }

  if (modified) {
    try {
      // Add import at the top if not present
      if (!content.includes("from '../config/api'") && !content.includes('from "../config/api"')) {
        // Find the last import statement
        const importMatch = content.match(/^import .+;$/m);
        if (importMatch) {
          const importLine = importMatch[0];
          const newImport = `import { API_ENDPOINTS } from '../config/api';`;
          content = content.replace(importLine, importLine + '\n' + newImport);
        }
      }
      fs.writeFileSync(fullPath, content);
      console.log('Updated:', file);
      updated++;
    } catch (e) {
      console.error('Error updating', file, e.message);
      errors++;
    }
  }
});

console.log(`\nDone: ${updated} files updated, ${errors} errors`);
