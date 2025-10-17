import { spawn } from 'child_process';

const server = spawn('node', ['dist/index.js'], {
  env: {
    ...process.env,
    ROGERROGER_API_KEY: 'rr_9f2af08f338cc86c50292add79ab21d9'
  }
});

// Send a test request
const testRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

server.stdin.write(JSON.stringify(testRequest) + '\n');

server.stdout.on('data', (data) => {
  console.log('Server response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString());
});