export interface Schema {
  /**
   * The name of the component.
   */
  name: string;

  /**
   * The prefix for the actions.
   */
  prefix: string;

  /**
   * The path to create the component.
   */
  path?: string;

  /**
   * The name of the project.
   */
  project?: string;

  /**
   * When true, does not create test files.
   */
  skipTests?: boolean;

  /**
   * Flag to indicate if a dir is created.
   */

  flat?: boolean;

  /**
   * Group actions file within 'actions' folder
   */
  group?: boolean;

  /**
   * Specifies if api success and failure actions
   * should be generated.
   */
  api?: boolean;

  /**
   * Specifies whether to use creator functions for
   * handling actions and reducers.
   */
  creators?: boolean;
}
