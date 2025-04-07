
// This file contains the logic to check if the API server is running

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

export const checkApiServer = async (): Promise<void> => {
  try {
    // First check if the server is already running
    const isRunning = await checkServerStatus();
    if (isRunning) {
      console.log('API server is already running');
    } else {
      console.log('API server is not running. Please start it manually.');
      // You could show a toast notification here
    }
  } catch (error) {
    console.error('Error checking API server status:', error);
  }
};
