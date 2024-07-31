import { Component, InjectionToken, inject } from '@angular/core';
import { ApiMemberSummary } from '@ngrx-io/shared';
import { SymbolHeaderComponent } from './symbol-header.component';
import { SymbolApiComponent } from './symbol-api.component';
import { SymbolSummaryComponent } from './symbol-summary.component';

export const SYMBOl_POPOVER_REF = new InjectionToken<ApiMemberSummary>(
  'SYMBOl_POPOVER_REF'
);

@Component({
  selector: 'ngrx-symbol-popover',
  standalone: true,
  imports: [SymbolHeaderComponent, SymbolApiComponent, SymbolSummaryComponent],
  template: `
    <div class="popover">
      <ngrx-symbol-header [symbol]="symbol" />
      <ngrx-symbol-summary [symbol]="symbol" />
      <ngrx-symbol-api [symbol]="symbol" />
    </div>
  `,
  styles: [
    `
      .popover {
        display: flex;
        flex-direction: column;
        width: 500px;
        background-color: rgba(16, 8, 20, 0.72);
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(8px);
        overflow-y: hidden;
      }
    `,
  ],
})
export class SymbolPopoverComponent {
  summary = inject(SYMBOl_POPOVER_REF);
  symbol = this.summary.members[0];
}
