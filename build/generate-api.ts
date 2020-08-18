import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
  Project,
  ExportedDeclarations,
  SourceFile,
  Node,
  JSDoc,
  FunctionDeclaration,
} from 'ts-morph';
import {
  format as prettier,
  resolveConfig,
  Options as PrettierOptions,
} from 'prettier';
import { stripIndents } from 'common-tags';

const OUTPUT_DIRECTORY = join('docs', 'api');

generateApi();

function generateApi() {
  const files = getBarrelFiles();
  const output = files
    .map(generateApiForFile)
    .reduce((acc, file) => acc.concat(file), []);

  writeFile(OUTPUT_DIRECTORY, 'output.json', JSON.stringify(output), 'json');
  createMarkdown(output);
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
    const overloadSignatures = kindToFormatter[kind];
    if (overloadSignatures) {
      fileOutput.push({
        kind,
        module,
        name,
        overloads: overloadSignatures(declaration),
      });
    }
  }

  return fileOutput;
}

function createMarkdown(output: Output[]) {
  for (const out of output) {
    const directory = join(OUTPUT_DIRECTORY, toFileName(out.module));
    const file = toFileName(out.name);

    const overloadToText = (
      overload: Output['overloads'][0],
      heading = '##'
    ) => {
      const sections = overload.info.reduce((section, [title, value]) => {
        if (typeof value === 'string') {
          section[title] = stripIndents`
            ## ${title}

            ${value}
          `;
        } else {
          section[title] =
            section[title] ||
            stripIndents`
              ${heading} Parameters

              | Name  | Type | Description  |
              | ----- |----- | ------------ |`;
          section[
            title
          ] += `\n| ${value.label} | \`${value.type}\` | ${value.description} |`;
        }
        return section;
      }, {} as { [title: string]: string });

      const { description, ...sectionsToDocs } = sections;
      const sectionsText = Object.values(sectionsToDocs).join('\n');
      const text = stripIndents`
        ${description || ''}

        \`\`\`ts
        ${implementation.signature}
        \`\`\`

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

        ${overloads.map((o) => overloadToText(o, '###')).join('\n')}
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

  const appendParametersToInfo = (functionDeclaration: FunctionDeclaration) => {
    const info = getInformation(implementation.getJsDocs());

    const params = functionDeclaration.getParameters();
    for (const param of params) {
      const paramName = param.getName();
      const type = param.getType().getText(param);
      const existingInfo = info.find(
        ([tag, value]) =>
          tag === 'param' &&
          typeof value !== 'string' &&
          value.label === paramName
      );

      if (existingInfo) {
        (existingInfo[1] as any).type = type;
      } else {
        info.push([
          'param',
          {
            label: paramName,
            description: '',
            type,
          },
        ]);
      }
    }

    return info;
  };

  return [
    {
      signature: format(implementation.removeBody().getText().substr(7)),
      info: appendParametersToInfo(implementation),
    },
    ...overloads.map((overload) => ({
      signature: format(overload.getText().substr(7)),
      info: appendParametersToInfo(overload),
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

  let name = declaration.getName();
  const types = declaration.getTypeParameters().map((p) => p.getText());
  const extend = declaration.getExtends()?.getText();
  const implement = declaration.getImplements().map((p) => p.getText());
  const publicProperties = declaration
    .getProperties()
    .filter((p) => p.getScope() === 'public')
    .map((p) => p.getText())
    .map(removeComments);
  const publicMethods = declaration
    .getMethods()
    .filter((p) => p.getScope() === 'public')
    .map((p) => p.removeBody().getText())
    .map(removeComments);

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

  return [
    {
      signature: format(signature),
      info: getInformation(declaration.getJsDocs()),
    },
  ];
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
              label: param,
              description: (description || []).join(' '),
              type: '',
            },
          ];
        } else {
          information[++tagIndex] = [tagName, lineText.join(' ')];
        }
      } else if (information[tagIndex]) {
        // append text to the current tag
        const current = information[tagIndex];
        if (typeof current[1] == 'string') {
          current[1] += '\n' + line;
        } else {
          // TODO: what to do here?
          // current[1].description += '\n' + line;
        }
      } else {
        // doc without tag, or text above the first tag
        information[++tagIndex] = ['description', line];
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
    .filter(([_, value]) => !!value)
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
    signature: string;
    info: [
      string,
      string | { label: string; description: string; type: string }
    ][];
  }[];
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
