export interface Schema {
  name: string;
  skipPackageJson?: boolean;
  path?: string;
  project?: string;
  module?: string;
  statePath?: string;
  stateInterface?: string;
}
