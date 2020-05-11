export interface Schema {
  /**
   * The path to create the component.
   */
  path?: string;
  /**
   * The name of the project.
   */
  project?: string;
  /**
   * The name of the component.
   */
  name: string;
  /**
   * Specifies if the style will be in the ts file.
   */
  inlineStyle?: boolean;
  /**
   * Specifies if the template will be in the ts file.
   */
  inlineTemplate?: boolean;
  /**
   * Specifies the view encapsulation strategy.
   */
  viewEncapsulation?: 'Emulated' | 'Native' | 'None';
  /**
   * Specifies the change detection strategy.
   */
  changeDetection?: 'Default' | 'OnPush';
  /**
   * The prefix to apply to generated selectors.
   */
  prefix?: string;
  /**
   * The file extension or preprocessor to use for style files.
   */
  style?: string;
  /**
   * When true, does not create test files.
   */
  skipTests?: boolean;
  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;
  /**
   * Flag to skip the module import.
   */
  skipImport?: boolean;
  /**
   * The selector to use for the component.
   */
  selector?: string;
  /**
   * Allows specification of the declaring module.
   */
  module?: string;
  /**
   * Specifies if declaring module exports the component.
   */
  export?: boolean;
  /**
   * Specifies the path to the state exports
   */
  state?: string;

  /**
   * Specifies the interface for the state
   */
  stateInterface?: string;

  /**
   * Specifies whether to create a unit test or an integration test.
   */
  testDepth?: string;
}
