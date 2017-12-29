# Actions

## Action reducers

Provide the `ActionReducerMap<T>` with your reducer map for added type checking.

```ts
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './auth';

export interface State {
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer
};
```

## Typed Actions

Use strongly typed actions to take advantage of TypeScript's compile-time checking.

```ts
// counter.actions.ts
import { Action } from '@ngrx/store';

export enum CounterActionTypes = {
  INCREMENT = '[Counter] Increment',
  DECREMENT = '[Counter] Decrement',
  RESET = '[Counter] Reset'
}

export class Increment implements Action {
  readonly type = CounterActionTypes.INCREMENT;
}

export class Decrement implements Action {
  readonly type = CounterActionTypes.DECREMENT;
}

export class Reset implements Action {
  readonly type = CounterActionTypes.RESET;

  constructor(public payload: number) {}
}

export type CounterActions
  = Increment
  | Decrement
  | Reset;
```

This provides typed actions for your reducer functions.

```ts
// counter.reducer.ts
import { CounterActionTypes, CounterActions } from './counter.actions';

export function reducer(state: number = 0, action: CounterActions): State {
  switch(action.type) {
    case CounterActionTypes.INCREMENT: {
      return state + 1;
    }

    case CounterActionTypes.DECREMENT: {
      return state - 1;
    }

    case CounterActionTypes.RESET: {
      return action.payload; // typed to number
    }

    default: {
      return state;
    }
  }
}
```

Instantiate actions and use `store.dispatch()` to dispatch them:

```ts
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as Counter from './counter.actions';

interface AppState {
  counter: number;
}

@Component({
  selector: 'my-app',
  template: `
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
    <button (click)="reset()">Reset Counter</button>
    
    <div>Current Count: {{ counter | async }}</div>
  `
})
export class MyAppComponent {
  counter: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.counter = store.pipe(select('counter'));
  }

  increment(){
    this.store.dispatch(new Counter.Increment());
  }

  decrement(){
    this.store.dispatch(new Counter.Decrement());
  }

  reset(){
    this.store.dispatch(new Counter.Reset(3));
  }
}
```
