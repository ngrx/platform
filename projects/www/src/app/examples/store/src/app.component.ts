import { Component } from '@angular/core';
import { MyCounterComponent } from './my-counter/my-counter.component';

@Component({
  selector: 'ngrx-app-root',
  imports: [MyCounterComponent],
  template: `
    <h1>NgRx Tutorial</h1>

    <app-my-counter></app-my-counter>
  `,
})
export class AppComponent {}
