# SignalState

Not every piece of state needs its own store. For this use case, `@ngrx/signals` comes with a `signalState` utility.

The `signalState` function is used: 

- To create and operate on small slices of state.
- Directly in your component class, service, or a standalone function.
- Provide a deeply nested signal of the object properties.

<code-example header="counter.component.ts">
import { Component } from '@angular/core';
import { signalState, patchState } from '@ngrx/signals';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    Count: {{ state.count() }} 

    &lt;button (click)="increment()"&gt;Increment&lt;/button&gt;
    &lt;button (click)="decrement()"&gt;Decrement&lt;/button&gt;
    &lt;button (click)="reset()"&gt;Reset&lt;/button&gt;
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
