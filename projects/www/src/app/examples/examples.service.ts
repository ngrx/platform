import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import type { StackblitzConfig } from '@ngrx-io/tools/vite-ngrx-stackblits.plugin';

const stackblitzProjectFiles = import.meta.glob(['./**/stackblitz.yml'], {
  import: 'default',
});
const exampleFiles = import.meta.glob(
  ['./**/*.ts', './**/*.html', './**/*.txt'],
  {
    import: 'default',
    query: '?raw',
  }
);

@Injectable({ providedIn: 'root' })
export class ExamplesService {
  async getConfig(exampleName: string): Promise<StackblitzConfig> {
    return (await stackblitzProjectFiles[
      `./${exampleName}/stackblitz.yml`
    ]()) as StackblitzConfig;
  }

  async load(element: HTMLElement, exampleName: string) {
    const config = await this.getConfig(exampleName);

    return sdk.embedProject(
      element,
      {
        title: config.name,
        description: config.description,
        template: 'node',
        files: {
          ...config.files,
        },
      },
      {
        clickToLoad: false,
        openFile: config.open,
      }
    );
  }

  async open(exampleName: string) {
    const config = await this.getConfig(exampleName);

    return sdk.openProject(
      {
        title: config.name,
        description: config.description,
        template: 'node',
        files: {
          ...config.files,
        },
      },
      {
        openFile: config.open,
      }
    );
  }

  async extractSnippet(path: string, region?: string): Promise<string> {
    try {
      // The raw content of a typescript file doesn't seem to be imported correctly
      // As a hack, we convert the .ts file to .txt (during the build)
      const exampleFilePath = path.endsWith('.ts')
        ? `./${path.replace('.ts', '.txt')}`
        : `./${path}`;
      const fileLoader = exampleFiles[exampleFilePath];
      if (!fileLoader) {
        return `// File not found: ${exampleFilePath}`;
      }

      const content = (await fileLoader()) as string;
      if (region) {
        const regionContent = this.extractRegion(content, region);
        return this.normalizeIndentation(regionContent);
      }

      return this.normalizeIndentation(content);
    } catch (error) {
      return `// Error loading code from ${path}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
    }
  }

  private extractRegion(content: string, region: string): string {
    if (!content) {
      return '';
    }
    const lines = content.split('\n');
    const startMarker = `#region ${region}`;
    const endMarker = `#endregion`;

    // Also support docregion markers like in Angular docs, across TS/JS/HTML comment styles
    // Examples:
    // // #docregion foo
    // /* #docregion foo */
    // <!-- #docregion foo -->
    const docRegionStartRegexes = [
      /\/\/\s*#docregion(?:\s+(.*))?\s*$/, // line comment
      /\/\*\s*#docregion(?:\s+(.*?))?\s*\*\/\s*$/, // block comment on one line
      /<!--\s*#docregion(?:\s+(.*?))?\s*-->/, // HTML comment
    ];
    const docRegionEndRegexes = [
      /\/\/\s*#enddocregion\b(?:\s+.*)?$/, // line comment with optional names
      /\/\*\s*#enddocregion(?:\s+.*?)?\s*\*\//, // block comment with optional names
      /<!--\s*#enddocregion(?:\s+.*?)?\s*-->/, // HTML comment with optional names
    ];

    let startIndex = -1;
    let endIndex = -1;

    // Look for region markers
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Handle //#region style
      if (line.includes(startMarker)) {
        startIndex = i + 1;
        continue;
      }

      // Enhanced handling of #docregion lines (supports //, /* */, and <!-- -->)
      if (line.includes('#docregion')) {
        for (const rx of docRegionStartRegexes) {
          const match = line.match(rx);
          if (match) {
            const declaredList = (match[1] ?? '')
              .split(',')
              .map((r) => r.trim())
              .filter((r) => r.length > 0);
            if (
              (declaredList.length === 0 && region === '') ||
              declaredList.includes(region)
            ) {
              startIndex = i + 1;
              break;
            }
          }
        }
        if (startIndex === i + 1) {
          continue;
        }
      }

      // End markers
      if (
        (line.includes(endMarker) ||
          docRegionEndRegexes.some((rx) => rx.test(line))) &&
        startIndex !== -1
      ) {
        endIndex = i;
        break;
      }
    }

    if (startIndex === -1) {
      return `// Region '${region}' not found in file`;
    }

    if (endIndex === -1) {
      endIndex = lines.length;
    }

    return lines.slice(startIndex, endIndex).join('\n');
  }

  private normalizeIndentation(code: string): string {
    const lines = code.split('\n');
    const firstNonEmpty = lines.find((l) => l.trim().length > 0) ?? '';
    const leadingSpacesMatch = firstNonEmpty.match(/^( +)/);

    if (leadingSpacesMatch) {
      const indent = leadingSpacesMatch[1];
      const indentLen = indent.length;
      // Normalize indentation: if the first non-empty line starts with spaces, remove that exact number from all lines starting with them
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(indent)) {
          lines[i] = lines[i].slice(indentLen);
        }
      }
    }

    return lines.join('\n').trim();
  }
}
