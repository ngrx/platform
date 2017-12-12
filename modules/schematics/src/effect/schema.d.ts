export interface Schema {
  name: string;
  path?: string;
  appRoot?: string;
  sourceDir?: string;
  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Allows specification of the declaring module.
   */
  module?: string;
  root?: boolean;
  feature?: boolean;
}
