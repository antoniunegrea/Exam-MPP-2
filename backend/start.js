const { spawn } = require('child_process');

console.log('Starting Election Candidates Backend...');

const child = spawn('npx', ['ts-node-dev', '--respawn', '--transpile-only', 'src/app.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start backend:', error);
});

child.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
}); 