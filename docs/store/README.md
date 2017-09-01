# @ngrx/store

RxJS powered state management for Angular applications, inspired by Redux

@ngrx/store is a controlled state container designed to help write performant, consistent applications
on top of Angular. Core tenets:
- State is a single immutable data structure
- Actions describe state changes
- Pure functions called reducers take the previous state and the next action to compute the new state
- State accessed with the `Store`, an observable of state and an observer of actions

These core principles enable building components that can use the `OnPush` change detection strategy
giving you [intelligent, performant change detection](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html#smarter-change-detection)
throughout your application.

### Installation
Install @ngrx/store from npm:

`npm install @ngrx/store --save` OR `yarn add @ngrx/store`


### Nightly builds

`npm install github:ngrx/store-builds` OR `yarn add github:ngrx/store-builds`


### Setup
Create a reducer function for each data type you have in your application. The combination of these reducers will
make up your application state:

```ts
// counter.ts
import { Action } from '@ngrx/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export function counterReducer(state: number = 0, action: Action) {
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

To register the state container within your application, import the reducers and use the `StoreModule.forRoot`
function in the `imports` array of the `@NgModule` decorator for your `AppModule`.

```ts
import { NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ counter: counterReducer })
  ]
})
export class AppModule {}
```


You can then inject the `Store` service into your components and services. Use `store.select` to _select_ slice(s) of state:

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
export class MyAppComponent {
	counter: Observable<number>;

	constructor(private store: Store<AppState>) {
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

## API Documentation
- [Action Reducers](./actions.md#action-reducers)
- [Injecting reducers](./api.md#injecting-reducers)
- [Meta-Reducers/Enhancers](./api.md#meta-reducers)
- [Injecting Meta-Reducers](./api.md#injecting-meta-reducers)
- [Providing initial state](./api.md#initial-state)
- [State composition through feature modules](./api.md#feature-module-state-composition)
- [State selectors](./selectors.md)
- [Testing](./testing.md)
- [Typed Actions](./actions.md#typed-actions)


### Additional Material
- [From Inactive to Reactive with ngrx](https://www.youtube.com/watch?v=cyaAhXHhxgk)
- [Reactive Angular 2 with ngrx (video)](https://youtu.be/mhA7zZ23Odw)
- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)
- [@ngrx/store in 10 minutes (video)](https://egghead.io/lessons/angular-2-ngrx-store-in-10-minutes)
- [Build Redux Style Applications with Angular, RxJS, and @ngrx/store (video)](https://egghead.io/courses/building-a-time-machine-with-angular-2-and-rxjs)
