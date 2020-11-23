import * as ts from 'typescript';
import { Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { Path } from '@angular-devkit/core';

/* istanbul ignore file */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface Host {
  write(path: string, content: string): Promise<void>;
  read(path: string): Promise<string>;
}

export interface Change {
  apply(host: Host): Promise<void>;

  // The file this change should be applied to. Some changes might not apply to
  // a file (maybe the config).
  readonly path: string | null;

  // The order this change should be applied. Normally the position inside the file.
  // Changes are applied from the bottom of a file to the top.
  readonly order: number;

  // The description of this change. This will be outputted in a dry or verbose run.
  readonly description: string;
}

/**
 * An operation that does nothing.
 */
export class NoopChange implements Change {
  description = 'No operation.';
  order = Infinity;
  path = null;
  apply() {
    return Promise.resolve();
  }
}

/**
 * Will add text to the source code.
 */
export class InsertChange implements Change {
  order: number;
  description: string;

  constructor(public path: string, public pos: number, public toAdd: string) {
    if (pos < 0) {
      throw new Error('Negative positions are invalid');
    }
    this.description = `Inserted ${toAdd} into position ${pos} of ${path}`;
    this.order = pos;
  }

  /**
   * This method does not insert spaces if there is none in the original string.
   */
  apply(host: Host) {
    return host.read(this.path).then((content) => {
      const prefix = content.substring(0, this.pos);
      const suffix = content.substring(this.pos);

      return host.write(this.path, `${prefix}${this.toAdd}${suffix}`);
    });
  }
}

/**
 * Will remove text from the source code.
 */
export class RemoveChange implements Change {
  order: number;
  description: string;

  constructor(public path: string, public pos: number, public end: number) {
    if (pos < 0 || end < 0) {
      throw new Error('Negative positions are invalid');
    }
    this.description = `Removed text in position ${pos} to ${end} of ${path}`;
    this.order = pos;
  }

  apply(host: Host): Promise<void> {
    return host.read(this.path).then((content) => {
      const prefix = content.substring(0, this.pos);
      const suffix = content.substring(this.end);

      // TODO: throw error if toRemove doesn't match removed string.
      return host.write(this.path, `${prefix}${suffix}`);
    });
  }
}

/**
 * Will replace text from the source code.
 */
export class ReplaceChange implements Change {
  order: number;
  description: string;

  constructor(
    public path: string,
    public pos: number,
    public oldText: string,
    public newText: string
  ) {
    if (pos < 0) {
      throw new Error('Negative positions are invalid');
    }
    this.description = `Replaced ${oldText} into position ${pos} of ${path} with ${newText}`;
    this.order = pos;
  }

  apply(host: Host): Promise<void> {
    return host.read(this.path).then((content) => {
      const prefix = content.substring(0, this.pos);
      const suffix = content.substring(this.pos + this.oldText.length);
      const text = content.substring(this.pos, this.pos + this.oldText.length);

      if (text !== this.oldText) {
        return Promise.reject(
          new Error(`Invalid replace: "${text}" != "${this.oldText}".`)
        );
      }

      // TODO: throw error if oldText doesn't match removed string.
      return host.write(this.path, `${prefix}${this.newText}${suffix}`);
    });
  }
}

export function createReplaceChange(
  sourceFile: ts.SourceFile,
  node: ts.Node,
  oldText: string,
  newText: string
): ReplaceChange {
  return new ReplaceChange(
    sourceFile.fileName,
    node.getStart(sourceFile),
    oldText,
    newText
  );
}

export function createRemoveChange(
  sourceFile: ts.SourceFile,
  node: ts.Node,
  from = node.getStart(sourceFile),
  to = node.getEnd()
): RemoveChange {
  return new RemoveChange(sourceFile.fileName, from, to);
}

export function createChangeRecorder(
  tree: Tree,
  path: string,
  changes: Change[]
): UpdateRecorder {
  const recorder = tree.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove(change.pos, change.end - change.pos);
    } else if (change instanceof ReplaceChange) {
      recorder.remove(change.pos, change.oldText.length);
      recorder.insertLeft(change.pos, change.newText);
    }
  }
  return recorder;
}

export function commitChanges(tree: Tree, path: string, changes: Change[]) {
  if (changes.length === 0) {
    return false;
  }

  const recorder = createChangeRecorder(tree, path, changes);
  tree.commitUpdate(recorder);
  return true;
}
