import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngrx-code-example',
  standalone: true,
  template: `
    <div class="header">{{ header }}</div>
    <div class="body">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .header {
        padding: 8px 16px;
        background-color: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 12px;
        font-weight: 500;
      }

      .body {
        padding: 0px 0px;
        overflow-x: wrap;
      }
    `,
  ],
})
export class CodeExampleComponent {
  @Input() header: string = '';
}
