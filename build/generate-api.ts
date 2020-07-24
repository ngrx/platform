import { writeFileSync } from 'fs';
import {
  Project,
  ExportedDeclarations,
  SourceFile,
  Node,
  JSDoc,
} from 'ts-morph';
import {
  format as prettier,
  resolveConfig,
  Options as PrettierOptions,
} from 'prettier';

generateApi();

function generateApi() {
  const files = getBarrelFiles();
  const output = files
    .map(generateApiForFile)
    .reduce((acc, file) => acc.concat(file), []);
  const formattedOutput = format(JSON.stringify(output), 'json');
  writeFileSync('./output.json', formattedOutput, 'utf-8');
}

function getBarrelFiles() {
  const project = new Project();
  project.addSourceFilesAtPaths('./modules/*/index.ts');
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
      signature: format(implementation.removeBody().getText().substr(7)),
      info: getInformation(implementation.getJsDocs()),
    },
    ...overloads.map((o) => ({
      signature: format(o.getText().substr(7)),
      info: getInformation(o.getJsDocs()),
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

function getInformation(docs: JSDoc[]) {
  if (!docs.length) {
    return [];
  }

  const infos = docs.map((doc) => {
    let tagIndex = -1;
    const information: [string, string][] = [];

    // manually parse the jsDoc tags
    // ts-morph doesn't handle multi line tag text?
    const text = doc.getText();
    const lines = text
      .replace(/\r\n/g, '\n')
      .split('\n')
      // remove the first line: /**
      .filter((_, i) => i > 0)
      // remove the leading astrerix (*)
      .map((l) => l.trim().substr(2).trim());

    for (const line of lines) {
      // we hit a tag, create a new entry
      if (line.startsWith('@')) {
        let [tagName, ...lineText] = line.substr(1).split(' ');
        information[++tagIndex] = [tagName, lineText.join(' ')];
      } else if (information[tagIndex]) {
        // append text to the current tag
        information[tagIndex][1] = (
          information[tagIndex][1] +
          '\n' +
          line
        ).trim();
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
    .map(([label, value]) => [label, format(value, 'markdown')]);
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
    info: [string, string][];
  }[];
}
