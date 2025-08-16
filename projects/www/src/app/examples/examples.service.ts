import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import type { StackblitzConfig } from '@ngrx-io/tools/vite-ngrx-stackblits.plugin';

const stackblitzProjectFiles = import.meta.glob(['./**/stackblitz.yml'], {
  import: 'default',
});
const exampleFiles = import.meta.glob(['./**/*.txt'], {
  import: 'default',
  query: '?raw',
});

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
      const txtPath = `./${path.replace('.ts', '.txt')}`;
      const fileLoader = exampleFiles[txtPath];
      if (!fileLoader) {
        return `// File not found: ${path}`;
      }

      const content = (await fileLoader()) as string;
      console.log({
        fileLoader,
        content,
      });

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

    // Also support docregion markers like in Angular docs
    const docStartMarker = `// #docregion ${region}`;
    const docEndMarker = `// #enddocregion`;

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

      // Enhanced handling of // #docregion lines that may declare multiple regions separated by commas
      if (line.startsWith('//') && line.includes('#docregion')) {
        // Example: // #docregion providers, init
        const match = line.match(/\/\/\s*#docregion\s+(.*)$/);
        if (match) {
          const declared = match[1]
            .split(',')
            .map((r) => r.trim())
            .filter((r) => r.length > 0); // array of region names
          // If no specific regions listed (empty array) and region is empty string, treat as match
          if (
            (declared.length === 0 && region === '') ||
            declared.includes(region)
          ) {
            startIndex = i + 1;
            continue;
          }
        }
        // Fallback to legacy single-region substring check for backward compatibility
        if (line.includes(docStartMarker)) {
          startIndex = i + 1;
          continue;
        }
      }

      // End markers
      if (
        (line.includes(endMarker) || line.includes(docEndMarker)) &&
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
