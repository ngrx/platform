import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative } from 'path';
import {
  Project,
  ExportedDeclarations,
  SourceFile,
  Node,
  JSDoc,
  FunctionDeclaration,
  ClassDeclaration,
  MethodDeclaration,
  ClassMemberTypes,
  PropertyDeclaration,
} from 'ts-morph';
import {
  format as prettier,
  resolveConfig,
  Options as PrettierOptions,
} from 'prettier';
import { stripIndents } from 'common-tags';
import * as rimraf from 'rimraf';
import { git } from './util';

const OUTPUT_DIRECTORY = join('docs', 'api');

(async () => {
  generateApi();
})();

async function generateApi() {
  const files = getBarrelFiles();
  const output = files
    .map(generateApiForFile)
    .reduce((acc, file) => acc.concat(file), []);

  rimraf.sync(OUTPUT_DIRECTORY);
  writeFile(OUTPUT_DIRECTORY, 'output.json', JSON.stringify(output), 'json');
  await createMarkdown(output);
}

function getBarrelFiles() {
  const project = new Project();
  const excludedModules = ['schematics-core'].join('|');
  project.addSourceFilesAtPaths(`./modules/!(${excludedModules})/index.ts`);
  const files = project.getSourceFiles();
  return files;
}

function generateApiForFile(sourceFile: SourceFile) {
  const module = sourceFile.getDirectory().getBaseName();
  const exportDeclarations = sourceFile.getExportedDeclarations();
  const entries = exportDeclarations.entries();
  let entry: IteratorResult<[string, ExportedDeclarations[]]>;

  const fileOutput: Output[] = [];
  while ((entry = entries.next()) && !entry.done) {
    const [name, declarations] = entry.value as [
      string,
      ExportedDeclarations[]
    ];
    const [declaration] = declarations;
    const kind = declaration.getKindName();

    const kindToFormatter: {
      [key: string]: (declaration: ExportedDeclarations) => Output['overloads'];
    } = {
      FunctionDeclaration: formatFunctionDeclaration,
      ClassDeclaration: formatClassDeclaration,
      InterfaceDeclaration: formatInterfaceDeclaration,
      VariableDeclaration: formatVariableDeclaration,
      TypeAliasDeclaration: formatTypeAliasDeclaration,
      EnumDeclaration: formatEnumDeclaration,
    };
    const declarationFormatter = kindToFormatter[kind];
    if (declarationFormatter) {
      fileOutput.push({
        kind,
        module,
        name,
        overloads: declarationFormatter(declaration),
      });
    }
  }

  return fileOutput;
}

async function createMarkdown(output: Output[]) {
  let repoUrl = await git(['config --get remote.origin.url']);
  repoUrl = repoUrl.trim().replace('.git', '') + '/blob/master/';
  for (const out of output) {
    const directory = join(OUTPUT_DIRECTORY, toFileName(out.module));
    const file = toFileName(out.name);

    const overloadToText = (
      overload: Output['overloads'][0],
      headerLevel = 2,
      parent = ''
    ) => {
      const createHeader = (title: string, headerlevelOverride = headerLevel) =>
        parent
          ? `${'#'.repeat(
              headerlevelOverride
            )} ${title} (#${parent}-${toFileName(title)})`
          : `${'#'.repeat(headerlevelOverride)} ${title}`;
      const sections = overload.info.reduce((section, [title, value]) => {
        if (value.__kind === 'heading') {
          section[title] = stripIndents`
            ${createHeader(title)}

            ${value.description}
          `;
        } else if (value.__kind === 'table') {
          section[title] =
            section[title] ||
            stripIndents`
              ${createHeader('Parameters')}

              | Name  | Type | Description  |
              | ----- |----- | ------------ |`;
          section[
            title
          ] += `\n| ${value.label} | \`${value.type}\` | ${value.description} |`;
        } else if (value.__kind === 'info') {
          // must be unique, otherwise it will get appended
          section[title] = section[title] || createHeader('Methods');
          const infoMd = overloadToText(
            value.info,
            headerLevel + 2,
            value.header
          );
          section[title] += `\n ${createHeader(
            value.header,
            headerLevel + 1
          )}\n${infoMd}`;
        }
        return section;
      }, {} as { [title: string]: string });

      const { description, ...sectionsToDocs } = sections;
      const sectionsText = Object.values(sectionsToDocs).join('\n');
      const text = stripIndents`
        ${description || ''}

        \`\`\`ts
        ${overload.signature}
        \`\`\`

        [Link to repo](${repoUrl}${overload.file})

        ${sectionsText}
      `;
      return text;
    };

    const implementationToText = (overload: Output['overloads'][0]) => {
      return overloadToText(overload);
    };

    const overloadsToText = (overloads: Output['overloads'][0][]) => {
      if (overloads.length === 0) return '';

      return stripIndents`
        ## Overloads

        ${overloads.map((o) => overloadToText(o, 3)).join('\n')}
      `;
    };

    const [implementation, ...overloads] = out.overloads;
    const md = stripIndents`
      ---
      kind: ${out.kind}
      name: ${out.name}
      module: ${out.module}
      ---

      # ${out.name}

      ${implementationToText(implementation)}
      ${overloadsToText(overloads)}`;

    writeFile(directory, file + '.md', md, 'markdown');
  }
}

function formatFunctionDeclaration(
  declaration: ExportedDeclarations
): Output['overloads'] {
  if (!Node.isFunctionDeclaration(declaration)) {
    throw Error('Declaration is not a function');
  }

  const implementation = declaration.getImplementation();
  const overloads = declaration.getOverloads();
  return [
    {
      file: fileWithLineNumbers(implementation),
      signature: format(getSignature(implementation).substr(7)),
      info: getInformationWithParemetersInfo(implementation),
    },
    ...overloads.map((overload) => ({
      file: fileWithLineNumbers(overload),
      signature: format(overload.getText().substr(7)),
      info: getInformationWithParemetersInfo(overload),
    })),
  ];
}

function formatVariableDeclaration(
  declaration: ExportedDeclarations
): Output['overloads'] {
  if (!Node.isVariableDeclaration(declaration)) {
    throw Error('Declaration is not a variable');
  }

  const name = declaration.getName();
  const type = declaration.getType().getText(declaration);
  const signature = `const ${name}: ${type}`;

  return [
    {
      file: fileWithLineNumbers(declaration),
      signature: format(signature),
      info: [],
    },
  ];
}

function formatTypeAliasDeclaration(
  declaration: ExportedDeclarations
): Output['overloads'] {
  if (!Node.isTypeAliasDeclaration(declaration)) {
    throw Error('Declaration is not a type alias');
  }

  return [
    {
      file: fileWithLineNumbers(declaration),
      signature: format(declaration.getText()),
      info: getInformation(declaration.getJsDocs()),
    },
  ];
}

function formatEnumDeclaration(
  declaration: ExportedDeclarations
): Output['overloads'] {
  if (!Node.isEnumDeclaration(declaration)) {
    throw Error('Declaration is not an enum');
  }

  return [
    {
      file: fileWithLineNumbers(declaration),
      signature: format(declaration.getText()),
      info: getInformation(declaration.getJsDocs()),
    },
  ];
}

function formatInterfaceDeclaration(
  declaration: ExportedDeclarations
): Output['overloads'] {
  if (!Node.isInterfaceDeclaration(declaration)) {
    throw Error('Declaration is not an interface');
  }

  const name = declaration.getName();
  const types = declaration.getTypeParameters().map((p) => p.getText());
  const properties = declaration.getProperties().map((p) => p.getText());
  const extendedproperties = declaration
    .getBaseDeclarations()
    .map((b) =>
      Node.isInterfaceDeclaration(b)
        ? [
            ``,
            `// inherited from ${b.getName()}`,
            ...b.getProperties().map((p) => p.getText()),
          ]
        : []
    )
    .reduce((props, prop) => props.concat(prop), []);
  const allProperties = properties.concat(extendedproperties);

  let signature = `interface ${name}`;

  if (types.length) {
    signature += `<${types.join(', ')}>`;
  }

  signature += `{\n${allProperties.join('\n')}\n}`;

  return [
    {
      file: fileWithLineNumbers(declaration),
      signature: format(signature),
      info: getInformation(declaration.getJsDocs()),
    },
  ];
}

function formatClassDeclaration(
  declaration: ExportedDeclarations
): Output['overloads'] {
  if (!Node.isClassDeclaration(declaration)) {
    throw Error('Declaration is not a class');
  }

  const isPublic = (
    n: MethodDeclaration | ClassMemberTypes | PropertyDeclaration
  ) => n.getScope() === 'public';
  const getPublicMethods = (classDeclaration: ClassDeclaration) =>
    classDeclaration
      .getMethods()
      .filter(isPublic)
      .map((method) => [method.getImplementation(), ...method.getOverloads()])
      .reduce((a, b) => [...a, ...b], [])
      .filter(Boolean);
  const getPublicProperties = (classDeclaration: ClassDeclaration) =>
    classDeclaration.getProperties().filter(isPublic);

  const createSignature = () => {
    let name = declaration.getName();
    const types = declaration.getTypeParameters().map((p) => p.getText());
    const extend = declaration.getExtends()?.getText();
    const implement = declaration.getImplements().map((p) => p.getText());
    const publicProperties = getPublicProperties(declaration)
      .map((p) => p.getText())
      .map(removeComments);
    const publicMethods = getPublicMethods(declaration).map(getSignature);

    let signature = `class ${name}`;

    if (types.length) {
      signature += `<${types.join(', ')}>`;
    }

    if (extend) {
      signature += ` extends ${extend}`;
    }

    if (implement.length) {
      signature += ` implements ${implement.join(', ')}`;
    }

    signature += `{`;
    signature += `\n${publicProperties.join('\n')}\n`;
    signature += `\n${publicMethods.join('\n')}\n`;
    signature += '}';
    return signature;
  };

  const appendClassMembersInfo = (classDeclaration: ClassDeclaration) => {
    const info = getInformation(classDeclaration.getJsDocs());

    const methods = getPublicMethods(classDeclaration);
    const properties = getPublicProperties(classDeclaration);

    for (const method of methods) {
      const methodName = method.getName();
      info.push([
        'method',
        {
          __kind: 'info',
          header: methodName,
          info: {
            file: fileWithLineNumbers(method),
            info: getInformationWithParemetersInfo(method),
            signature: getSignature(method)
              .replace(/\r\n/g, '\n')
              .replace(/\n/g, '')
              .replace(/  /g, ' '),
          },
        },
      ]);
    }

    for (const prop of properties) {
      const propName = prop.getName();
      info.push([
        'property',
        {
          __kind: 'table',
          label: propName,
          type: prop.getType().getText(prop),
          description: prop.getJsDocs()[0]?.getText() || '',
        },
      ]);
    }

    return info;
  };

  return [
    {
      file: fileWithLineNumbers(declaration),
      info: appendClassMembersInfo(declaration),
      signature: format(createSignature()),
    },
  ];
}

function getSignature(declaration: FunctionDeclaration | MethodDeclaration) {
  const bt = declaration.getBodyText();
  const signature = declaration.removeBody().getText();
  if (bt) {
    declaration.setBodyText(bt);
  }
  return removeComments(signature).trim();
}

function getInformation(docs: JSDoc[]): Output['overloads'][0]['info'] {
  if (!docs.length) {
    return [];
  }

  const infos = docs.map((doc) => {
    let tagIndex = -1;
    const information: Output['overloads'][0]['info'] = [];

    // manually parse the jsDoc tags
    // ts-morph doesn't handle multi line tag text?
    const text = doc.getText();
    const lines = text
      .replace(/\r\n/g, '\n')
      .split('\n')
      // remove the first line: /**
      .filter((_, i) => i > 0)
      // remove the leading astrerix (*)
      .map((l) => l.trim().substr(2).trimLeft());

    for (const line of lines) {
      // we hit a tag, create a new entry
      if (line.startsWith('@')) {
        let [tagName, ...lineText] = line.substr(1).split(' ');
        if (tagName === 'param') {
          const [param, ...description] = lineText;
          information[++tagIndex] = [
            tagName,
            {
              __kind: 'table',
              label: param,
              description: (description || []).join(' '),
              type: '',
            },
          ];
        } else {
          information[++tagIndex] = [
            tagName,
            {
              __kind: 'heading',
              description: lineText.join(' '),
            },
          ];
        }
      } else if (information[tagIndex]) {
        // append text to the current tag
        const current = information[tagIndex];
        if (current[1].__kind === 'heading') {
          current[1].description += '\n' + line;
        } else {
          // TODO: what to do here?
        }
      } else {
        // doc without tag, or text above the first tag
        information[++tagIndex] = [
          'description',
          {
            __kind: 'heading',
            description: line || '',
          },
        ];
      }
    }

    // remove empty lines at the end of a tag
    for (const tag of information) {
      while (tag[tag.length - 1] === '') {
        tag.length -= 1;
      }
    }

    return information;
  });

  return infos
    .reduce((a, b) => [...a, ...b])
    .filter(([_, value]) => value)
    .map(([label, value]) => [label, value]);
}

/**
 * Remove comments from code because these are ment to be internal
 * Also, they cause problems to format
 */
function removeComments(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((p) => !p.trimLeft().startsWith('//'))
    .map((p) => {
      const comment = p.indexOf('//');
      return comment === -1 ? p : p.substr(0, comment);
    })
    .join('\n');
}

function getInformationWithParemetersInfo(
  functionDeclaration: FunctionDeclaration | MethodDeclaration
) {
  const info = getInformation(functionDeclaration.getJsDocs());
  const params = functionDeclaration.getParameters();
  for (const param of params) {
    const paramName = param.getName();
    const type = param.getType().getText(param);
    const existingInfo = info.find(
      ([tag, value]) =>
        tag === 'param' && value.__kind === 'table' && value.label === paramName
    );

    if (existingInfo) {
      (existingInfo[1] as any).type = type;
    } else {
      info.push([
        'param',
        {
          __kind: 'table',
          label: paramName,
          description: '',
          type,
        },
      ]);
    }
  }

  return info;
}

/**
 * Use prettier to format code, will throw if code isn't correct
 */
function format(
  code: string,
  parser: PrettierOptions['parser'] = 'typescript'
) {
  const prettierConfig = resolveConfig.sync(__dirname);
  try {
    return prettier(code, {
      parser,
      ...prettierConfig,
    }).trim();
  } catch (err) {
    console.error('Could not format: \n\n' + code);
    return code;
  }
}

interface Output {
  module: string;
  kind: string;
  name: string;
  overloads: {
    file: string;
    signature: string;
    info: [
      string,
      (
        | { __kind: 'heading'; description: string }
        | { __kind: 'table'; label: string; description: string; type: string }
        | {
            __kind: 'info';
            header: string;
            info: Output['overloads'][0];
          }
      )
    ][];
  }[];
}

function fileWithLineNumbers(node: Node) {
  const file = node.getSourceFile();
  const filePath = relative(process.cwd(), file.getFilePath()).replace(
    /\\/g,
    '/'
  );
  return `${filePath}#L${node.getStartLineNumber()}-L${node.getEndLineNumber()}`;
}

function toFileName(s: string): string {
  return s
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[ _]/g, '-');
}

function writeFile(
  directory: string,
  fileName: string,
  content: string,
  type: PrettierOptions['parser']
) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const contentFormatted = format(content, type) + '\n';
  writeFileSync(join(directory, fileName), contentFormatted, 'utf-8');
}
