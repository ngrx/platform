import { Component, computed, input } from '@angular/core';
import { ApiMember } from '@ngrx-io/shared';
import { SymbolExcerptComponent } from './symbol-excerpt.component';

@Component({
  selector: 'ngrx-symbol-type-params',
  standalone: true,
  imports: [SymbolExcerptComponent],
  template: `
    @for (param of params(); track $index) {
      <div class="param">
        <code class="paramSymbol">{{ '@type' }}</code>
        <code class="name">{{ param.name }}</code>
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
        display: grid;
        padding: 8px;
        align-items: center;
        grid-template-columns: 96px 112px 1fr;
        gap: 16px;
      }

      .param:last-child {
        border-bottom: 1px solid var(--ngrx-border-color);
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
    `,
  ],
})
export class SymbolTypeParamsComponent {
  symbol = input.required<ApiMember>();
  params = computed(() => {
    const parameters = this.symbol().typeParameters || [];
    return parameters.map((param) => {
      return {
        name: param.typeParameterName,
        excerptTokens: [
          ...this.symbol().excerptTokens.slice(
            param.constraintTokenRange.startIndex,
            param.constraintTokenRange.endIndex
          ),
        ],
      };
    });
  });
}
