import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngrx-symbol-code-link',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <a mat-stroked-button [href]="url()" target="_blank">
      <mat-icon>code</mat-icon>
      View Source on Github
    </a>
  `,
})
export class SymbolCodeLinkComponent {
  fileUrlPath = input.required<string>();
  url = computed(() => {
    const [, fileName] = this.fileUrlPath().split('dist/');
    const actualFileName = fileName.replace('.d.ts', '.ts');

    return `https://github.com/ngrx/platform/blob/main/${actualFileName}`;
  });
}
