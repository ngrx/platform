export interface Schema {
  path?: string;
  effects?: boolean;
  skipPackageJson?: boolean;
  project?: string;
  module?: string;
  migrateNgrxData?: boolean;
  entityConfig?: boolean;
}
