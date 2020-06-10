import { Component, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { combineReducers, select, Store, StoreModule } from '../../';
import { counterReducer, DECREMENT, INCREMENT } from '../fixtures/counter';
import { todos } from '../fixtures/todos';

@Component({
  selector: 'ngc-spec-child-component',
  template: ``,
})
export class NgcSpecChildComponent {}

@NgModule({
  imports: [StoreModule.forFeature('feature', { todos: todos })],
  declarations: [NgcSpecChildComponent],
  exports: [NgcSpecChildComponent],
})
export class FeatureModule {}

export interface AppState {
  count: number;
}

export const reducerToken = new InjectionToken('Reducers');

@Component({
  selector: 'ngc-spec-component',
  template: `
    <button (click)="increment()">+</button>
    <span> Count : {{ count | async }} </span>
    <button (click)="decrement()">+</button>

    <ngc-spec-child-component></ngc-spec-child-component>
  `,
})
export class NgcSpecComponent {
  count: Observable<number>;
  constructor(public store: Store<AppState>) {
    this.count = store.pipe(select((state) => state.count));
  }
  increment() {
    this.store.dispatch({ type: INCREMENT });
  }
  decrement() {
    this.store.dispatch({ type: DECREMENT });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducerToken, {
      initialState: { count: 0 },
      reducerFactory: combineReducers,
    }),
    FeatureModule,
  ],
  providers: [
    {
      provide: reducerToken,
      useValue: { count: counterReducer },
    },
  ],
  declarations: [NgcSpecComponent],
  bootstrap: [NgcSpecComponent],
})
export class NgcSpecModule {}
