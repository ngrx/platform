import { Tree, Rule, chain } from '@angular-devkit/schematics';
import {
  commitChanges,
  visitTemplates,
  ReplaceChange,
  Change,
} from '@ngrx/schematics/schematics-core';

const ASYNC_REGEXP = /\| {0,}async/g;

export function migrateToCreators(): Rule {
  return (host: Tree) =>
    visitTemplates(host, template => {
      let match: RegExpMatchArray | null;
      let changes: Change[] = [];
      while ((match = ASYNC_REGEXP.exec(template.content)) !== null) {
        const m = match.toString();

        changes.push(
          new ReplaceChange(
            template.fileName,
            template.start + match.index!,
            m,
            m.replace('async', 'ngrxPush')
          )
        );
      }

      return commitChanges(host, template.fileName, changes);
    });
}

export default function(): Rule {
  return chain([migrateToCreators()]);
}
