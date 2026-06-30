// Build helper: runs tsc -b && vite build without relying on shell && operator.
// Workaround for npm 11 + cmd.exe encoding issue on Windows (code page 65001).
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
const nodeBin = process.execPath;
const tscBin = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');

function run(jsFile, args) {
  const result = spawnSync(nodeBin, [jsFile, ...args], {
    stdio: 'inherit',
    shell: false,
    cwd: root,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(tscBin, ['-b']);
run(viteBin, ['build']);
