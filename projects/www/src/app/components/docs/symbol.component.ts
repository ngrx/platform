import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ApiMemberSummary } from '@ngrx-io/shared';
import { SymbolApiComponent } from './symbol-api.component';
import { SymbolCodeLinkComponent } from './symbol-code-link.component';
import { SymbolExcerptComponent } from './symbol-excerpt.component';
import { SymbolHeaderComponent } from './symbol-header.component';
import { SymbolMethodsComponent } from './symbol-methods.component';
import { SymbolParamsComponent } from './symbol-params.component';
import { SymbolReturnsComponent } from './symbol-returns.component';
import { SymbolSummaryComponent } from './symbol-summary.component';
import { SymbolTypeParamsComponent } from './symbol-type-params.component';
import { SymbolUsageNotesComponent } from './symbol-usage-notes.component';

@Component({
  selector: 'ngrx-symbol',
  standalone: true,
  template: `
    <div class="header">
      <h1>{{ summary().name }}</h1>
      <ngrx-symbol-code-link [fileUrlPath]="summary().fileUrlPath" />
    </div>

    @for (symbol of summary().members; track $index) {
    <div class="symbol-call-signature">
      <ngrx-symbol-header [symbol]="symbol" />
      <ngrx-symbol-summary [symbol]="symbol" />
      <ngrx-symbol-api [symbol]="symbol" />
      <ngrx-symbol-params [symbol]="symbol" />
      <ngrx-symbol-type-params [symbol]="symbol" />
      <ngrx-symbol-returns [symbol]="symbol" />
      <ngrx-symbol-usage-notes [symbol]="symbol" />
      <ngrx-symbol-methods [symbol]="symbol" />

      <!-- <pre>{{ symbol | json }}</pre> -->
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        max-width: 960px;
        margin: 0 auto;
        padding: 54px 0 24px;
        @media only screen and (max-width: 1280px) {
          padding: 90px 30px 24px;
          max-width: 100%;
        }
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media only screen and (max-width: 600px) {
          flex-wrap: wrap;
        }
      }

      h1 {
        margin: 0;
        @media only screen and (max-width: 600px) {
          margin-bottom: 10px;
        }
      }

      .symbol-call-signature {
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        margin: 16px 0;
        max-width: 100%;
        overflow-y: auto;
      }
    `,
  ],
  imports: [
    SymbolExcerptComponent,
    SymbolParamsComponent,
    SymbolTypeParamsComponent,
    SymbolHeaderComponent,
    SymbolCodeLinkComponent,
    SymbolApiComponent,
    SymbolSummaryComponent,
    SymbolMethodsComponent,
    SymbolReturnsComponent,
    SymbolUsageNotesComponent,
    AsyncPipe,
    JsonPipe,
  ],
})
export class SymbolComponent {
  summary = input.required<ApiMemberSummary>();
}
