export interface Schema {
  name: string;
  skipPackageJson?: boolean;
  path?: string;
  project?: string;
  flat?: boolean;
  spec?: boolean;
  module?: string;
  statePath?: string;
  stateInterface?: string;
}
