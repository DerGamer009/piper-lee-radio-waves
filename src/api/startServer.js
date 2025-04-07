
// Simple script to start the Express API server

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const serverPath = path.join(__dirname, 'server.js');

// Check if server file exists
if (!fs.existsSync(serverPath)) {
  console.error(`Server file not found at ${serverPath}`);
  process.exit(1);
}

// Start the server
console.log('Starting API server...');
const server = exec(`node ${serverPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting server: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Server error: ${stderr}`);
    return;
  }
  console.log(`Server output: ${stdout}`);
});

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);
});

console.log('API server started in background');
