import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain,
  externalSchematic,
  apply,
  url,
  noop,
  filter,
  template,
  move,
  mergeWith,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import * as stringUtils from '../utility/strings';
import { buildRelativePath } from '../utility/find-module';
import { NoopChange, InsertChange, ReplaceChange } from '../utility/change';
import { insertImport } from '../utility/route-utils';
import { omit } from '../utility/ngrx-utils';

export const ContainerOptions = require('./schema.json');
export type ContainerOptions = {
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
};

function addStateToComponent(options: ContainerOptions) {
  return (host: Tree) => {
    if (!options.state && !options.stateInterface) {
      return host;
    }

    const statePath = `/${options.sourceDir}/${options.path}/${options.state}`;

    if (options.state) {
      if (!host.exists(statePath)) {
        throw new Error('Specified state path does not exist');
      }
    }

    const componentPath =
      `/${options.sourceDir}/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      stringUtils.dasherize(options.name) +
      '.component.ts';

    const text = host.read(componentPath);

    if (text === null) {
      throw new SchematicsException(`File ${componentPath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      componentPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const stateImportPath = buildRelativePath(componentPath, statePath);
    const storeImport = insertImport(
      source,
      componentPath,
      'Store',
      '@ngrx/store'
    );
    const stateImport = options.state
      ? insertImport(
          source,
          componentPath,
          `* as fromStore`,
          stateImportPath,
          true
        )
      : new NoopChange();

    const componentClass = source.statements.find(
      stm => stm.kind === ts.SyntaxKind.ClassDeclaration
    );
    const component = componentClass as ts.ClassDeclaration;
    const componentConstructor = component.members.find(
      member => member.kind === ts.SyntaxKind.Constructor
    );
    const cmpCtr = componentConstructor as ts.ConstructorDeclaration;
    const { pos } = cmpCtr;
    const stateType = options.state
      ? `fromStore.${options.stateInterface}`
      : 'any';
    const constructorText = cmpCtr.getText();
    const [start, end] = constructorText.split('()');
    const storeText = `private store: Store<${stateType}>`;
    const storeConstructor = [start, `(${storeText})`, end].join('');
    const constructorUpdate = new ReplaceChange(
      componentPath,
      pos,
      `  ${constructorText}\n\n`,
      `\n\n  ${storeConstructor}`
    );

    const changes = [storeImport, stateImport, constructorUpdate];
    const recorder = host.beginUpdate(componentPath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      } else if (change instanceof ReplaceChange) {
        recorder.remove(pos, change.oldText.length);
        recorder.insertLeft(change.order, change.newText);
      }
    }

    host.commitUpdate(recorder);

    return host;
  };
}

export default function(options: ContainerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const sourceDir = options.sourceDir;

    if (!sourceDir) {
      throw new SchematicsException(`sourceDir option is required.`);
    }

    const opts = ['state', 'stateInterface'].reduce(
      (current: Partial<ContainerOptions>, key) => {
        return omit(current, key as any);
      },
      options
    );

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
      template({
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...stringUtils,
        ...(options as object),
        dot: () => '.',
      } as any),
      move(sourceDir),
    ]);

    return chain([
      externalSchematic('@schematics/angular', 'component', {
        ...opts,
        spec: false,
      }),
      addStateToComponent(options),
      mergeWith(templateSource),
    ])(host, context);
  };
}
