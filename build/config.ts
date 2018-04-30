export interface PackageDescription {
  name: string;
  hasTestingModule: boolean;
  bundle: boolean;
  hasSchematics: boolean;
}

export interface Config {
  packages: PackageDescription[];
  scope: string;
}

export const packages: PackageDescription[] = [
  {
    name: 'store',
    hasTestingModule: false,
    bundle: true,
    hasSchematics: true,
  },
  {
    name: 'effects',
    hasTestingModule: true,
    bundle: true,
    hasSchematics: false,
  },
  {
    name: 'router-store',
    hasTestingModule: false,
    bundle: true,
    hasSchematics: false,
  },
  {
    name: 'store-devtools',
    hasTestingModule: false,
    bundle: true,
    hasSchematics: false,
  },
  {
    name: 'entity',
    hasTestingModule: false,
    bundle: true,
    hasSchematics: false,
  },
  {
    name: 'schematics',
    hasTestingModule: false,
    bundle: false,
    hasSchematics: false,
  },
];
