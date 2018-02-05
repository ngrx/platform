export interface PackageDescription {
  name: string;
  hasTestingModule: boolean;
  bundle: boolean;
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
  },
  {
    name: 'effects',
    hasTestingModule: true,
    bundle: true,
  },
  {
    name: 'router-store',
    hasTestingModule: false,
    bundle: true,
  },
  {
    name: 'store-devtools',
    hasTestingModule: false,
    bundle: true,
  },
  {
    name: 'entity',
    hasTestingModule: false,
    bundle: true,
  },
  {
    name: 'codegen',
    hasTestingModule: false,
    bundle: true,
  },
  {
    name: 'schematics',
    hasTestingModule: false,
    bundle: false,
  },
];
