import { Component } from '@angular/core';

@Component({
  selector: 'ngrx-symbol-excerpt-group',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 8px;
        gap: 2px;
        overflow-x: scroll;
      }
    `,
  ],
})
export class SymbolExcerptGroupComponent {}
