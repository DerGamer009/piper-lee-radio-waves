
// This file contains the logic to auto-start the API server

import { spawn } from 'child_process';
import { join } from 'path';

let serverProcess: any = null;

export const startServer = () => {
  if (serverProcess) {
    console.log('Server already running');
    return;
  }
  
  try {
    const serverPath = join(process.cwd(), 'src', 'api', 'server.js');
    console.log(`Attempting to start server from ${serverPath}`);
    
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
    });
    
    serverProcess.on('close', (code: number) => {
      console.log(`API server process exited with code ${code}`);
      serverProcess = null;
    });
    
    console.log('API server started');
  } catch (error) {
    console.error('Error starting API server:', error);
  }
};

export const stopServer = () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
    console.log('API server stopped');
  }
};
