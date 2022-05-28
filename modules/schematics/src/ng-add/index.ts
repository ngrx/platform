import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { getWorkspace, getWorkspacePath } from '../../schematics-core';

function updateSchematicCollections(host: Tree) {
  const workspace = getWorkspace(host);
  const path = getWorkspacePath(host);

  if (!(workspace['cli'] && workspace['cli']['schematicCollections'])) {
    throw new Error(
      'schematicCollections is not defined in the global cli options'
    );
  }

  workspace['cli']['schematicCollections'] = [
    ...workspace['cli']['schematicCollections'],
    '@ngrx/schematics',
  ];
  host.overwrite(path, JSON.stringify(workspace, null, 2));
}

function updateWorkspaceCli() {
  return (host: Tree) => {
    updateSchematicCollections(host);
    return host;
  };
}

export default function (): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([updateWorkspaceCli()])(host, context);
  };
}
