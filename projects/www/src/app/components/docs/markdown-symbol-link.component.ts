import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SymbolLinkComponent } from './symbol-link.component';
import { CanonicalReference } from '@ngrx-io/shared';

@Component({
  selector: 'ngrx-markdown-symbol-link',
  standalone: true,
  imports: [SymbolLinkComponent],
  template: ` <ngrx-symbol-link [reference]="reference"></ngrx-symbol-link> `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ngrx-docs-symbol-link {
        color: #ffdcbe;
      }

      ngrx-docs-symbol-link a {
        font-family: 'Space Mono', monospace;
        font-variant-ligatures: none;
        font-weight: 600;
        text-decoration: none;
      }
    `,
  ],
})
export class MarkdownSymbolLinkComponent {
  @Input() reference: CanonicalReference = '@ngrx/store!Store:class';
}
