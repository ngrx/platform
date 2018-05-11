import * as fs from 'fs';

export interface PackageDescription {
  name: string;
}

export interface Config {
  packages: PackageDescription[];
  scope: string;
}

const modulesDir = './modules/';
export const packages: PackageDescription[] = fs
  .readdirSync(modulesDir)
  .filter(path => {
    const stat = fs.statSync(`${modulesDir}${path}`);
    const isDir = stat.isDirectory();

    if (!isDir) {
      return false;
    }

    const hasBuild = fs.existsSync(`${modulesDir}${path}/BUILD`);

    return hasBuild;
  })
  .map(pkg => ({ name: pkg }));
