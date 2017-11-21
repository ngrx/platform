export interface Schema {
  name: string;
  appRoot?: string;
  path?: string;
  sourceDir?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;
  module?: string;
  feature?: boolean;
  reducers?: string;
}
