// Simple script to start the Express API server

import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current file directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server.mjs');

// Check if server file exists
if (!fs.existsSync(serverPath)) {
  console.error(`Server file not found at ${serverPath}`);
  process.exit(1);
}

// Start the server
console.log('Starting API server...');
const server = fork(serverPath, [], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3001'
  }
});

server.on('error', (err) => {
  console.error(`Server error: ${err.message}`);
  process.exit(1);
});

// This will keep the process running as long as the child is running
console.log('API server started in background');
