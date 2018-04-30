export interface Schema {
  name: string;
  path?: string;
  flat?: boolean;
  spec?: boolean;
  module?: string;
  statePath?: string;
  stateInterface?: string;
}
