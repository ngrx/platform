import { Component, computed, input } from '@angular/core';
import { ApiMember } from '@ngrx-io/shared';
import { SymbolExcerptComponent } from './symbol-excerpt.component';
import { InlineMarkdownPipe } from './inline-markdown.pipe';

@Component({
  selector: 'ngrx-symbol-params',
  standalone: true,
  imports: [SymbolExcerptComponent, InlineMarkdownPipe],
  template: `
    @for (param of params(); track $index) {
      <div class="param">
        <div class="header">
          @if (param.required) {
            <code class="paramSymbol">{{ '@param' }}</code>
          } @else {
            <code class="paramSymbol">{{ '@optional' }}</code>
          }
          <code class="name">{{ param.name }}</code>
          @if (param.description) {
            <p [innerHtml]="param.description | ngrxInlineMarkdown"></p>
          }
        </div>

        <ngrx-symbol-excerpt [excerptTokens]="param.excerptTokens" />
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        border-top: 1px solid var(--ngrx-border-color);
      }

      .param {
        display: flex;
        flex-direction: column;
        padding: 8px;
      }

      .header {
        display: grid;
        align-items: center;
        grid-template-columns: 96px 112px 1fr;
        gap: 16px;
      }

      .paramSymbol {
        font-weight: 700;
        color: var(--ngrx-link);
      }

      code {
        font-family: 'Oxanium', sans-serif;
        padding: 0.25em 0.5em;
        border-radius: 4px;
        font-size: 15px;
      }

      p {
        font-size: 13px;
        padding: 0;
        margin: 0;
      }
    `,
  ],
})
export class SymbolParamsComponent {
  symbol = input.required<ApiMember>();
  params = computed(() => {
    const parameters = this.symbol().parameters || [];
    return parameters.map((param) => {
      const docs = this.symbol().docs.params.find(
        (p) => p.name === param.parameterName
      );

      return {
        name: param.parameterName,
        required: !param.isOptional,
        excerptTokens: this.symbol().excerptTokens.slice(
          param.parameterTypeTokenRange.startIndex,
          param.parameterTypeTokenRange.endIndex
        ),
        description: docs?.description || '',
      };
    });
  });
}
