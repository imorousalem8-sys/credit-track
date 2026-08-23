const fs = require('fs');
const path = require('path');

function generateVersion() {
  const now = new Date();
  
  // Format: YYYYMMDD-HHmmss
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const buildId = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  const versionString = `4.2.0`;

  let gitCommit = 'prod';
  try {
    const { execSync } = require('child_process');
    gitCommit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch (e) {
    gitCommit = 'nocommit';
  }

  const versionData = {
    version: versionString,
    build: buildId,
    commit: gitCommit,
    timestamp: now.toISOString(),
    builtAt: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  };

  const jsonContent = JSON.stringify(versionData, null, 2);

  // 1. Write to credittrack-next/public/version.json
  const nextPublicPath = path.join(__dirname, '..', 'public', 'version.json');
  fs.writeFileSync(nextPublicPath, jsonContent, 'utf-8');
  console.log(`[Version Generator] Generated ${nextPublicPath} -> Build: ${buildId} (Commit: ${gitCommit})`);

  // 2. Also write to root version.json if root exists
  const rootVersionPath = path.join(__dirname, '..', '..', 'version.json');
  try {
    if (fs.existsSync(path.dirname(rootVersionPath))) {
      fs.writeFileSync(rootVersionPath, jsonContent, 'utf-8');
      console.log(`[Version Generator] Synchronized root version at ${rootVersionPath}`);
    }
  } catch (e) {
    console.warn(`[Version Generator] Could not write to root version.json`, e.message);
  }
}

generateVersion();
