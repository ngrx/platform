import { Component, ViewEncapsulation, input } from '@angular/core';
import { ApiMember } from '@ngrx-io/shared';
import { MarkdownPipe } from './markdown.pipe';

@Component({
  selector: 'ngrx-symbol-summary',
  standalone: true,
  imports: [MarkdownPipe],
  template: `
    @if (symbol().docs.summary; as summary) {
      <div class="summary" [innerHtml]="summary | ngrxMarkdown"></div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ngrx-symbol-summary .summary {
        display: block;
        padding: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      ngrx-symbol-summary p:first-of-type {
        margin: 0;
      }
    `,
  ],
})
export class SymbolSummaryComponent {
  symbol = input.required<ApiMember>();
}
