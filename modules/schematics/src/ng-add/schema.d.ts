export interface Schema {
  path?: string;
  sourceDir?: string;
  name: string;
  effectName?: string;
  effect?: boolean;
  module?: string;
  flat?: boolean;
  spec?: boolean;
  statePath?: string;
  group?: boolean;
}
