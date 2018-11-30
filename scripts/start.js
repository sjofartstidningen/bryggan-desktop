const path = require('path');
const { spawn } = require('child_process');

const cp = spawn('electron', ['.'], {
  cwd: path.join(__dirname, '..'),
  stdio: [process.stdin, process.stdout, process.stderr],
});

process.on('exit', () => cp.kill());
