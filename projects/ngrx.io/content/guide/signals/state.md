## Signal State

Not every piece of state needs its own store. For this use case, `@ngrx/signals` comes with a `signalState` utility function to quickly create and operate on small slices of state. This can be used directly in your component class, service, or a standalone function.

<code-example header="counter.component.ts">
import { Component } from '@angular/core';
import { signalState, patchState } from '@ngrx/signals';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    Count: {{ state.count() }} 

    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
    <button (click)="reset()">Reset</button>
  `,
})
export class CounterComponent {
  state = signalState({ count: 0 });

  increment() {
    patchState(this.state, (state) => ({ count: state.count + 1 }));
  }

  decrement() {
    patchState(this.state, (state) => ({ count: state.count - 1 }));
  }

  reset() {
    patchState(this.state, { count: 0 });
  }
}
</code-example>

The `patchState` utility function provides a type-safe way to perform immutable updates on pieces of state.