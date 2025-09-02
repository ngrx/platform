import { globSync } from 'tinyglobby';
import * as fs from 'node:fs';

function copyTsFilesToTxt() {
  const files = globSync(['./src/app/examples/**/*.ts']);

  files.forEach((file) => {
    const txtFile = file.replace('.ts', '.txt');
    fs.writeFileSync(txtFile, fs.readFileSync(file));
  });
}

copyTsFilesToTxt();
