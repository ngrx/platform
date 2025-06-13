import { Component, computed, input } from '@angular/core';
import { ApiMember, ParsedCanonicalReference } from '@ngrx-io/shared';
import { SymbolExcerptComponent } from './symbol-excerpt.component';
import { NgClass } from '@angular/common';
import { DeprecatedChipComponent } from './deprecated-chip.component';

@Component({
  selector: 'ngrx-symbol-header',
  standalone: true,
  imports: [SymbolExcerptComponent, NgClass, DeprecatedChipComponent],
  template: `
    <h3 [ngClass]="{ deprecated: symbol().docs.deprecated }">
      <span class="symbolImport">{{ symbolImport() }}</span>
      <span class="symbolName">{{ symbol().name }}</span>
    </h3>

    @if (typeTokenRange().length) {
    <ngrx-symbol-excerpt [excerptTokens]="typeTokenRange()" />
    } @if (symbol().docs.deprecated) {
    <ngrx-deprecated-chip [reason]="symbol().docs.deprecated" />
    }
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr max-content max-content;
        align-items: center;
        padding: 16px;
        gap: 16px;
        @media only screen and (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }

      h3 {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      h3 .symbolImport {
        font-size: 12px;
        font-family: 'Oxanium', monospace;
        font-weight: 700;
        color: #fface6;
      }

      h3 .symbolName {
        font-size: 18px;
        font-family: 'Oxanium', monospace;
        font-weight: 500;
      }

      h3.deprecated {
        text-decoration: line-through;
      }
    `,
  ],
})
export class SymbolHeaderComponent {
  symbol = input.required<ApiMember>();
  symbolImport = computed(() => {
    const parsedRef = new ParsedCanonicalReference(
      this.symbol().canonicalReference
    );

    return parsedRef.package;
  });
  typeTokenRange = computed(() => {
    const typeTokenRange = this.symbol().typeTokenRange;
    const returnTypeTokenRange = this.symbol().returnTypeTokenRange;
    const variableTypeTokenRange = this.symbol().variableTypeTokenRange;

    if (typeTokenRange) {
      return this.symbol().excerptTokens.slice(
        typeTokenRange.startIndex,
        typeTokenRange.endIndex
      );
    }

    if (returnTypeTokenRange) {
      return this.symbol().excerptTokens.slice(
        returnTypeTokenRange.startIndex,
        returnTypeTokenRange.endIndex
      );
    }

    if (variableTypeTokenRange) {
      return this.symbol().excerptTokens.slice(
        variableTypeTokenRange.startIndex,
        variableTypeTokenRange.endIndex
      );
    }

    return [];
  });
}
