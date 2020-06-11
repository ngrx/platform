import { EOL } from 'os';
import { readFileSync, writeFileSync } from 'fs';
import * as glob from 'glob';
import * as readline from 'readline';

// get the version from the command
// e.g. ts-node ./build/update-version-numbers.ts 10.0.0
const [newVersion] = process.argv.slice(2);

if (newVersion) {
  updateVersions(newVersion);
} else {
  // if no version is provided, ask for it
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`What's the new version? `, (version) => {
    rl.close();
    updateVersions(version);
  });
}

function updateVersions(updatedVersion: string) {
  glob.sync('**/package.json', { ignore: '**/node_modules/**' }).map((file) => {
    const content = readFileSync(file, 'utf-8');
    const pkg = JSON.parse(content);
    if (pkg?.version && pkg?.name?.startsWith('@ngrx')) {
      pkg.version = updatedVersion;
      const updatedContent = JSON.stringify(pkg, null, 2);
      writeFileSync(file, `${updatedContent}${EOL}`);
    }
  });
}
