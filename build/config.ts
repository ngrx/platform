export interface PackageDescription {
  name: string;
  hasTestingModule: boolean;
}

export interface Config {
  packages: PackageDescription[];
  scope: string;
}

export const packages: PackageDescription[] = [
  {
    name: 'store',
    hasTestingModule: false,
  },
  {
    name: 'effects',
    hasTestingModule: true,
  },
  {
    name: 'router-store',
    hasTestingModule: false,
  },
  {
    name: 'store-devtools',
    hasTestingModule: false,
  },
];
