import { Component } from '@angular/core';
import { MyCounterComponent } from './my-counter/my-counter.component';

@Component({
  selector: 'ngrx-root',
  imports: [MyCounterComponent],
  template: `
    <h1>NgRx Tutorial</h1>

    <ngrx-my-counter></ngrx-my-counter>
  `,
})
export class AppComponent {}
