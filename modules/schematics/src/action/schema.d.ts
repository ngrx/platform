export interface Schema {
  name: string;
  appRoot?: string;
  path?: string;
  sourceDir?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  flat?: boolean;
}
