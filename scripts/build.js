const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

function copyRecursiveSync(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(child => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(srcDir, distDir);
fs.copyFileSync(path.join(__dirname, '../package.json'), path.join(distDir, 'package.json'));

const { execSync } = require('child_process');
execSync('npm install --production', { cwd: distDir, stdio: 'inherit' });
execSync('powershell Compress-Archive -Path * -DestinationPath lambda.zip -Force', { cwd: distDir, stdio: 'inherit' });

// Remove all files/folders in dist except lambda.zip
ds = fs.readdirSync(distDir);
ds.forEach(item => {
  if (item !== 'lambda.zip') {
    const itemPath = path.join(distDir, item);
    fs.rmSync(itemPath, { recursive: true, force: true });
  }
});
