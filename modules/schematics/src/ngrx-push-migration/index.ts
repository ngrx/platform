import * as ts from 'typescript';
import { Tree, Rule, chain } from '@angular-devkit/schematics';
import {
  commitChanges,
  visitTemplates,
  ReplaceChange,
  Change,
  visitTSSourceFiles,
  visitNgModuleImports,
  visitNgModuleExports,
  addImportToModule,
  addExportToModule,
} from '../../schematics-core';

const ASYNC_REGEXP = /\| {0,}async/g;
const PUSH_MODULE = 'PushModule';
const COMPONENT_MODULE = '@ngrx/component';

const pushModuleToFind = (node: ts.Node) =>
  ts.isIdentifier(node) && node.text === PUSH_MODULE;

const ngModulesToFind = (node: ts.Node) =>
  ts.isIdentifier(node) &&
  (node.text === 'CommonModule' || node.text === 'BrowserModule');

export function migrateToNgrxPush(): Rule {
  return (host: Tree) =>
    visitTemplates(host, (template) => {
      let match: RegExpMatchArray | null;
      const changes: Change[] = [];
      while ((match = ASYNC_REGEXP.exec(template.content)) !== null) {
        const m = match.toString();

        changes.push(
          new ReplaceChange(
            template.fileName,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            template.start + match.index!,
            m,
            m.replace('async', 'ngrxPush')
          )
        );
      }

      return commitChanges(host, template.fileName, changes);
    });
}

export function importPushModule(): Rule {
  return (host: Tree) => {
    visitTSSourceFiles(host, (sourceFile) => {
      let hasCommonModuleOrBrowserModule = false;
      let hasPushModule = false;

      visitNgModuleImports(sourceFile, (_, importNodes) => {
        hasCommonModuleOrBrowserModule = importNodes.some(ngModulesToFind);
        hasPushModule = importNodes.some(pushModuleToFind);
      });

      if (hasCommonModuleOrBrowserModule && !hasPushModule) {
        const changes: Change[] = addImportToModule(
          sourceFile,
          sourceFile.fileName,
          PUSH_MODULE,
          COMPONENT_MODULE
        );
        commitChanges(host, sourceFile.fileName, changes);
      }
    });
  };
}

export function exportPushModule(): Rule {
  return (host: Tree) => {
    visitTSSourceFiles(host, (sourceFile) => {
      let hasCommonModuleOrBrowserModule = false;
      let hasPushModule = false;

      visitNgModuleExports(sourceFile, (_, exportNodes) => {
        hasCommonModuleOrBrowserModule = exportNodes.some(ngModulesToFind);
        hasPushModule = exportNodes.some(pushModuleToFind);
      });

      if (hasCommonModuleOrBrowserModule && !hasPushModule) {
        const changes: Change[] = addExportToModule(
          sourceFile,
          sourceFile.fileName,
          PUSH_MODULE,
          COMPONENT_MODULE
        );
        commitChanges(host, sourceFile.fileName, changes);
      }
    });
  };
}

export default function (): Rule {
  return chain([migrateToNgrxPush(), importPushModule(), exportPushModule()]);
}
