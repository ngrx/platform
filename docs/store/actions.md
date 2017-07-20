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

export const INCREMENT  = '[Counter] Increment';
export const DECREMENT  = '[Counter] Decrement';
export const RESET      = '[Counter] Reset';

export class Increment implements Action {
  readonly type = INCREMENT;
}

export class Decrement implements Action {
  readonly type = DECREMENT;
}

export class Reset implements Action {
  readonly type = RESET;

  constructor(public payload: number) {}
}

export type All
  = Increment
  | Decrement
  | Reset;
```

This provides type actions for your reducer functions.

```ts
// counter.reducer.ts
import * as CounterActions from './counter.actions';

export type Action = CounterActions.All;

export function reducer(state: number = 0, action: Action): State {
  switch(action.type) {
    case CounterActions.INCREMENT: {
      return state + 1;
    }

    case CounterActions.DECREMENT: {
      return state - 1;
    }

    case CounterActions.RESET: {
      return action.payload; // typed to number
    }    

    default: {
      return state;
    }
  }
}
```

Instantiate actions and use `Store.dispatch()` to dispatch them:

```ts
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as Counter from './counter.actions';

interface AppState {
  counter: number;
}

@Component({
	selector: 'my-app',
	template: `
		<button (click)="increment()">Increment</button>
		<div>Current Count: {{ counter | async }}</div>
		<button (click)="decrement()">Decrement</button>

		<button (click)="reset()">Reset Counter</button>
	`
})
export class MyAppComponent {
	counter: Observable<number>;

	constructor(private store: Store<AppState>) {
		this.counter = store.select('counter');
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
