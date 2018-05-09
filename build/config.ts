import * as fs from 'fs';

export interface PackageDescription {
  name: string;
}

export interface Config {
  packages: PackageDescription[];
  scope: string;
}

export const packages: PackageDescription[] = fs
  .readdirSync('./modules/')
  .filter(path => {
    const stat = fs.statSync(`./modules/${path}`);
    const isDir = stat.isDirectory();

    if (!isDir) {
      return false;
    }

    const hasBuild = fs.existsSync(`./modules/${path}/BUILD`);

    return hasBuild;
  })
  .map(pkg => ({ name: pkg }));
