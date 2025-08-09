import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-slide-toggle (change)="logFirst($event)">Slide me!</mat-slide-toggle>
    <br />
    <mat-slide-toggle [checked]="true" (change)="logSecond($event)"
      >I'm ON initially</mat-slide-toggle
    >
  `,
})
export class AppComponent {
  logFirst(obj: { checked: boolean }) {
    console.log('first toggle:', obj.checked);
  }

  logSecond(obj: { checked: boolean }) {
    console.log('second toggle:', obj.checked);
  }
}
