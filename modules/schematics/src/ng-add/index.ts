import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
} from '@angular-devkit/schematics';
import {
  WorkspaceSchema,
  getWorkspacePath,
  getWorkspace,
} from '../../schematics-core/utility/config';
import { Schema as SchematicOptions } from './schema';

function updateWorkspace<K extends keyof WorkspaceSchema>(
  host: Tree,
  key: K,
  value: any
) {
  const workspace = getWorkspace(host);
  const path = getWorkspacePath(host);
  workspace[key] = value;
  host.overwrite(path, JSON.stringify(workspace, null, 2));
}

function setAsDefaultSchematics() {
  const cli = {
    defaultCollection: '@ngrx/schematics',
  };
  return (host: Tree) => {
    updateWorkspace(host, 'cli', cli);
    return host;
  };
}

export default function (options: SchematicOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      options && options.defaultCollection ? setAsDefaultSchematics() : noop(),
    ])(host, context);
  };
}
