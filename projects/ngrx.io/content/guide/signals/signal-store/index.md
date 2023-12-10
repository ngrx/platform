# SignalStore

For managing larger stores with more complex pieces of state, you can use the `signalStore` utility function, along with patchState, and other functions to manage the state.

## Creating a Store

To create a signal store, use the `signalStore` function and the `withState` function:

<code-example header="counter.store.ts">
import { signalStore, withState } from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 })
);
</code-example>

The `withState` function takes the initial state of the store and defines the shape of the state. 

<div class="callout is-critical">

  This store is not registered with _any_ injectors, and must be provided in a `providers` array at the component, route, or root level before injected.

</div>

## Defining Computed Values

Computed properties can also be derived from existing pieces of state in the store using the `withComputed` function.

<code-example header="counter.store.ts">
import { computed } from '@angular/core';
import { signalStore, patchState, withComputed } from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
);
</code-example>

The `doubleCount` computed signal reacts to changes to the `count` signal.

## Defining Store Methods

You can also define methods that are exposed publicly to operate on the store with a well-defined API.

<code-example header="counter.store.ts">
import { computed } from '@angular/core';
import { signalStore, patchState, withComputed, withMethods } from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods(({ count, ...store }) => ({
    increment() {
      patchState(store, { count: count() + 1 });
    },
    decrement() {
      patchState(store, { count: count() - 1 });
    },
  }))
);
</code-example>

## Providing and Injecting the Store

Stores can be used locally and globally.

### Providing a Component-Level SignalStore

To provide a store and tie it to a component's lifecycle, add it to the `providers` array of your component, and inject it using dependency injection.

<code-example header="counter.component.ts">
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CounterStore } from './counter.store';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    &lt;h1&gt;Counter (signalStore)&lt;/h1&gt;

    &lt;p&gt;Count: {{ store.count() }}&lt;/p&gt;
    &lt;p&gt;Double Count: {{ store.doubleCount() }}&lt;/p&gt;

    &lt;button (click)="store.increment()"&gt;Increment&lt;/button&gt;
    &lt;button (click)="store.decrement()"&gt;Decrement&lt;/button&gt;
  `,
  providers: [CounterStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CounterComponent {
  readonly store = inject(CounterStore);
}
</code-example>

### Providing a Global-Level SignalStore

You can also define a signal store to be used a global level. When defining the signal store, use the `providedIn` syntax:

<code-example header="counter.store.ts">
import { signalStore, withState } from '@ngrx/signals';

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 })
);
</code-example>

Now the store can be used globally across the application using a singleton instance.

<code-example header="counter.component.ts" linenumbers="false">
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CounterStore } from './counter.store';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    &lt;h1&gt;Counter (signalStore)&lt;/h1&gt;

    &lt;p&gt;Count: {{ store.count() }}&lt;/p&gt;
    &lt;p&gt;Double Count: {{ store.doubleCount() }}&lt;/p&gt;

    &lt;button (click)="store.increment()"&gt;Increment&lt;/button&gt;
    &lt;button (click)="store.decrement()"&gt;Decrement&lt;/button&gt;
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CounterComponent {
  readonly store = inject(CounterStore);
}
</code-example>
