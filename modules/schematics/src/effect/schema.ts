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
   * Specifies if this is a root-level effect
   */
  root?: boolean;

  /**
   * Specifies if this is grouped within a feature
   */
  feature?: boolean;

  /**
   * Specifies if this is grouped within an 'effects' folder
   */
  group?: boolean;

  /**
   * Specifies if effect has api success and failure actions wired up
   */
  api?: boolean;

  /**
   * Setup root effects module without registering initial effects.
   */
  minimal?: boolean;

  /**
   * The prefix for the effects.
   */
  prefix?: string;
}
