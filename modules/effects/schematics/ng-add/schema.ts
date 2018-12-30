export interface Schema {
  name: string;
  skipPackageJson?: boolean;
  path?: string;
  flat?: boolean;
  spec?: boolean;
  project?: string;
  module?: string;
  group?: boolean;
}
