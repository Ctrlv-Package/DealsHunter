const { exec } = require('child_process');
const path = require('path');

console.log('Stopping any running Node.js processes...');

// On Windows, we need to use taskkill
const command = process.platform === 'win32' 
  ? 'taskkill /F /IM node.exe'
  : 'pkill -f node';

exec(command, (error) => {
  if (error) {
    console.log('Note: No existing Node.js processes found or could not be killed');
  } else {
    console.log('Successfully stopped existing Node.js processes');
  }

  console.log('\nStarting server...');
  const serverPath = path.join(__dirname, '..', 'server.js');
  
  const server = exec(`node "${serverPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting server:', error);
      return;
    }
  });

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
});
