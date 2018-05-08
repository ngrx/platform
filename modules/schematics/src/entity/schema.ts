export interface Schema {
  /**
   * The name of the component.
   */

  name: string;
  /**
   * The path to create the effect.
   */

  path?: string;
  /**
   * The name of the project.
   */
  project?: string;
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
  /**
   * Allows specification of the declaring reducers.
   */

  reducers?: string;
  /**
   * Specifies if this is grouped within sub folders
   */

  group?: boolean;
}
