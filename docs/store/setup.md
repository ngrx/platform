# @ngrx/store

### Setup
Create a reducer function for each data type you have in your application. The combination of these reducers will
make up your application state:

```ts
// counter.ts
import { Action } from '@ngrx/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export function counter(state: number = 0, action: Action) {
	switch (action.type) {
		case INCREMENT:
			return state + 1;

		case DECREMENT:
			return state - 1;

		case RESET:
			return 0;

		default:
			return state;
	}
}
```

To register the global state container within your application, import those reducers and use the `StoreModule.forRoot`
function in the `imports` array them in the `AppModule`.

```ts
import { NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store';
import { counter } from './counter';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ counter: counter })
  ]
})
export class AppModule {}
```


You can then inject the `Store` service into your components and services. Use `store.select` to
_select_ slice(s) of state:

```ts
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { INCREMENT, DECREMENT, RESET } from './counter';

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
class MyAppComponent {
	counter: Observable<number>;

	constructor(private store: Store<AppState>){
		this.counter = store.select('counter');
	}

	increment(){
		this.store.dispatch({ type: INCREMENT });
	}

	decrement(){
		this.store.dispatch({ type: DECREMENT });
	}

	reset(){
		this.store.dispatch({ type: RESET });
	}
}
```
