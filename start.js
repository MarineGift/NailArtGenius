#!/usr/bin/env node
const { exec } = require('child_process');

console.log('🚀 Starting ConnieNail production server...');

exec('npx next start -p 5000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Start error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Start stderr: ${stderr}`);
  }
  console.log(stdout);
});