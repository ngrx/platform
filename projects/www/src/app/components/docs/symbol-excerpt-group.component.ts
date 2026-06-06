import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ngrx-symbol-excerpt-group',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 8px;
        gap: 2px;
        overflow-x: auto;
      }
    `,
  ],
})
export class SymbolExcerptGroupComponent {}
