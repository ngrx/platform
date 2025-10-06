import { Component, computed, input } from '@angular/core';
import { MarkdownPipe } from './markdown.pipe';
import { ApiMember } from '@ngrx-io/shared';

@Component({
  selector: 'ngrx-symbol-usage-notes',
  standalone: true,
  imports: [MarkdownPipe],
  template: `
    @if (notes()) {
      <div class="notes">
        <h3>{{ '@usageNotes' }}</h3>
        <div [innerHTML]="notes() | ngrxMarkdown"></div>
      </div>
    }
  `,
  styles: [
    `
      .notes {
        display: block;
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      h3 {
        font-family: 'Oxanium', monospace;
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        color: #fface6;
      }

      code {
        background: transparent;
      }
    `,
  ],
})
export class SymbolUsageNotesComponent {
  symbol = input.required<ApiMember>();
  notes = computed(() => this.symbol().docs.usageNotes);
}
