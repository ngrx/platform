import { Component, inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

const Store = signalStore(
  withState({ count: 0 }),
  withMethods((store) => ({
    increment() {
      patchState(store, (state) => ({ count: state.count + 1 }));
    },
    decrement() {
      patchState(store, (state) => ({ count: state.count - 1 }));
    },
  }))
);

@Component({
  selector: 'ngrx-app-root',
  template: `
    <h1>Count: {{ store.count() }}</h1>
    <button (click)="store.increment()">Increment</button>
    <button (click)="store.decrement()">Decrement</button>
  `,
  providers: [Store],
})
export class AppComponent {
  store = inject(Store);
}
