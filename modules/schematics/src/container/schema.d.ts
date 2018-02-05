export interface Schema {
  path?: string;
  appRoot?: string;
  sourceDir?: string;
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
  routing?: boolean;
  /**
   * The prefix to apply to generated selectors.
   */
  prefix?: string;
  /**
   * The file extension to be used for style files.
   */
  styleext?: string;
  spec?: boolean;
  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;
  htmlTemplate?: string;
  skipImport?: boolean;
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
}
