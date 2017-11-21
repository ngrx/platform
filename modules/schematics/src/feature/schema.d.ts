export interface Schema {
  path?: string;
  sourceDir?: string;
  name: string;
  module?: string;
  flat?: boolean;
  spec?: boolean;
  reducers?: string;
}
