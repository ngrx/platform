import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngrx-my-counter',
  template: `
    <button (click)="increment()">Increment</button>

    <div>Current Count: {{ count$ | async }}</div>

    <button (click)="decrement()">Decrement</button>

    <button (click)="reset()">Reset Counter</button>
  `,
})
export class MyCounterComponent {
  count$: Observable<number>;

  constructor() {
    // TODO: Connect `this.count$` stream to the current store `count` state
  }

  increment() {
    // TODO: Dispatch an increment action
  }

  decrement() {
    // TODO: Dispatch a decrement action
  }

  reset() {
    // TODO: Dispatch a reset action
  }
}
