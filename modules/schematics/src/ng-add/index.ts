import {chain, noop, Rule, SchematicContext, Tree,} from '@angular-devkit/schematics';
import {getWorkspace, getWorkspacePath} from '../../schematics-core';

import {Schema as SchematicOptions} from './schema';

function updateWorkspaceCli(host: Tree, value: any) {
  const workspace = getWorkspace(host);
  const path = getWorkspacePath(host);

  workspace['cli'] = {
    ...workspace['cli'],
    ...value
  };

  host.overwrite(path, JSON.stringify(workspace, null, 2));
}

function setAsDefaultSchematics() {
  const cli = {
    defaultCollection: '@ngrx/schematics',
  };
  return (host: Tree) => {
    updateWorkspaceCli(host, cli);
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
