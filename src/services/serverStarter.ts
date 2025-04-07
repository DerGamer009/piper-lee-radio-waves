
// This file contains the logic to auto-start the API server

import { spawn } from 'child_process';
import { join } from 'path';

let serverProcess: any = null;
let isStarting = false;
let retryCount = 0;
const MAX_RETRIES = 3;

// Function to check if the server is running
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/users', { 
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.log('API server is not running or not reachable');
    return false;
  }
};

export const startServer = async () => {
  // Prevent multiple start attempts
  if (serverProcess || isStarting) {
    console.log('Server already running or starting');
    return;
  }
  
  isStarting = true;
  
  try {
    // First check if the server is already running
    const isRunning = await checkServerStatus();
    if (isRunning) {
      console.log('API server is already running');
      isStarting = false;
      return;
    }
    
    const serverPath = join(process.cwd(), 'src', 'api', 'startServer.js');
    console.log(`Attempting to start server with script: ${serverPath}`);
    
    serverProcess = spawn('node', [serverPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: '3001'
      }
    });
    
    serverProcess.on('error', (err: Error) => {
      console.error('Failed to start API server:', err);
      serverProcess = null;
      isStarting = false;
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying server start (${retryCount}/${MAX_RETRIES})...`);
        setTimeout(startServer, 2000); // Wait 2 seconds before retry
      }
    });
    
    serverProcess.on('close', (code: number) => {
      console.log(`API server process exited with code ${code}`);
      serverProcess = null;
      isStarting = false;
    });
    
    // Wait a moment for server to start
    setTimeout(async () => {
      const serverRunning = await checkServerStatus();
      if (serverRunning) {
        console.log('API server started successfully');
      } else {
        console.log('API server may have failed to start properly');
      }
      isStarting = false;
    }, 3000);
    
    console.log('API server starting...');
  } catch (error) {
    console.error('Error starting API server:', error);
    isStarting = false;
  }
};

export const stopServer = () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
    console.log('API server stopped');
  }
};
