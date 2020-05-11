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
   * When true, does not create test files.
   */
  skipTests?: boolean;
  /**
   * Allows specification of the declaring module.
   */
  module?: string;
  /**
   * Specifies the dir for the state folder
   */

  statePath?: string;
  /**
   * Specifies whether this is the root state or feature state
   */

  root?: boolean;
  /**
   * Specifies the interface for the state
   */
  stateInterface?: string;
  /**
   * Setup state management without registering initial reducers.
   */
  minimal?: boolean;
}
