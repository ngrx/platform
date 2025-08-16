import * as globby from 'globby';
import * as fs from 'node:fs';

function copyTsFilesToTxt() {
  const files = globby.sync(['./src/app/examples/**/*.ts']);

  files.forEach((file) => {
    const txtFile = file.replace('.ts', '.txt');
    fs.writeFileSync(txtFile, fs.readFileSync(file));
  });
}

copyTsFilesToTxt();
