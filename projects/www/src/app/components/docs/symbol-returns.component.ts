import { Component, computed, input } from '@angular/core';
import { SymbolExcerptComponent } from './symbol-excerpt.component';
import { InlineMarkdownPipe } from './inline-markdown.pipe';
import { ApiMember } from '@ngrx-io/shared';

@Component({
  selector: 'ngrx-symbol-returns',
  standalone: true,
  imports: [SymbolExcerptComponent, InlineMarkdownPipe],
  template: `
    @if (returns(); as returns) {
    <div class="returns">
      <h4>{{ '@returns' }}</h4>
      <div [innerHtml]="returns.description | ngrxInlineMarkdown"></div>
      <ngrx-symbol-excerpt [excerptTokens]="returns.excerptTokens" />
    </div>
    }
  `,
  styles: [
    `
      .returns {
        display: grid;
        column-gap: 16px;
        grid-template-areas:
          'h4 description'
          'excerpt excerpt';
        grid-template-columns: 104px 1fr;
        padding: 8px;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      h4 {
        grid-area: h4;
        margin: 0;
        font-family: 'Oxanium', sans-serif;
        font-size: 15px;
        font-weight: 700;
        padding: 8px;
        color: #fface6;
      }

      div {
        grid-area: description;
        font-size: 13px;
      }

      ngrx-symbol-excerpt {
        grid-area: excerpt;
      }
    `,
  ],
})
export class SymbolReturnsComponent {
  symbol = input.required<ApiMember>();
  returns = computed(() => {
    const symbol = this.symbol();
    const returnTypeTokenRange = symbol.returnTypeTokenRange;

    if (!returnTypeTokenRange) {
      return;
    }

    return {
      description: symbol.docs.returns,
      excerptTokens: symbol.excerptTokens.slice(
        returnTypeTokenRange.startIndex,
        returnTypeTokenRange.endIndex
      ),
    };
  });
}
