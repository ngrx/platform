# @ngrx/store
RxJS powered state management for Angular applications, inspired by Redux

[![Join the chat at https://gitter.im/ngrx/store](https://badges.gitter.im/ngrx/store.svg)](https://gitter.im/ngrx/store?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI Status for ngrx/store](https://circleci.com/gh/ngrx/store.svg?style=shield&circle-token=aea1fc73de3419cd926fc95e627e036113646fd8
)](https://circleci.com/gh/ngrx/store)
[![npm version](https://badge.fury.io/js/%40ngrx%2Fstore.svg)](https://badge.fury.io/js/%40ngrx%2Fstore)

@ngrx/store is a controlled state container designed to help write performant, consistent applications
on top of Angular. Core tenets:
- State is a single immutable data structure
- Actions describe state changes
- Pure functions called reducers take previous slices of state and the next action to compute the new state
- State accessed with the `Store`, an observable of state and an observer of actions

These core principles enable building components that can use the `OnPush` change detection strategy
giving you [intelligent, performant change detection](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html#smarter-change-detection)
throughout your application.


### Installation
Install @ngrx/core and @ngrx/store from npm:
```bash
npm install @ngrx/core @ngrx/store --save
```

Optional packages:
- [@ngrx/store-devtools](https://github.com/ngrx/store-devtools) instruments your store letting you use a
[powerful time-travelling debugger](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en).
- [@ngrx/router-store](https://github.com/ngrx/router-store) keeps the state of @angular/router in your store
- [@ngrx/effects](https://github.com/ngrx/effects) isolates side effects from your UI by expressing side effects as sources of actions


### Examples
- [Official @ngrx/example-app](https://github.com/ngrx/example-app) is an officially maintained example application showcasing best practices
for @ngrx projects, including @ngrx/store and @ngrx/effects
- [angular-webpack2-starter](https://github.com/qdouble/angular-webpack2-starter) is a complete Webpack 2 starter with built-in support for @ngrx.
Includes Ahead-of-Time (AOT) compilation, hot module reloading (HMR), devtools, and server-side rendering.


### Introduction
- [Reactive Angular 2 with ngrx (video)](https://youtu.be/mhA7zZ23Odw)
- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)
- [@ngrx/store in 10 minutes (video)](https://egghead.io/lessons/angular-2-ngrx-store-in-10-minutes)
- [Build Redux Style Applications with Angular2, RxJS, and ngrx/store (video)](https://egghead.io/courses/building-a-time-machine-with-angular-2-and-rxjs)


### Setup
Create a reducer function for each data type you have in your application. The combination of these reducers will
make up your application state:

```ts
// counter.ts
import { ActionReducer, Action } from '@ngrx/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export function counterReducer(state: number = 0, action: Action): number {
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

In your app's main module, import those reducers and use the `StoreModule.forRoot(reducers)`
function to provide them to Angular's injector:

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


You can then inject the `Store` service into your components and services. Use `store.select` to
_select_ slice(s) of state:

```ts
import { Store } from '@ngrx/store';
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


## Contributing
Please read [contributing guidelines here](https://github.com/ngrx/store/blob/master/CONTRIBUTING.md).
