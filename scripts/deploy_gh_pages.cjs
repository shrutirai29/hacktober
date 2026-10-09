const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-pages-'));
console.log('Copying dist to', tempDir);
fs.cpSync('dist', tempDir, { recursive: true });

// Add .nojekyll so GitHub Pages does not ignore underscore files or assets
fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');

execSync('git init', { cwd: tempDir, stdio: 'inherit' });
execSync('git checkout -b gh-pages', { cwd: tempDir, stdio: 'inherit' });
execSync('git add -A', { cwd: tempDir, stdio: 'inherit' });
execSync('git commit -m "deploy: update GitHub Pages build"', { cwd: tempDir, stdio: 'inherit' });
execSync('git remote add origin https://github.com/shrutirai29/hacktober.git', { cwd: tempDir, stdio: 'inherit' });
execSync('git push -f origin gh-pages', { cwd: tempDir, stdio: 'inherit' });
console.log('Successfully pushed gh-pages branch!');
