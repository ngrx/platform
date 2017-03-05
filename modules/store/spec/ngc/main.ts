import { NgModule, Component } from '@angular/core';
import { platformDynamicServer } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '../../';
import { counterReducer, INCREMENT, DECREMENT } from '../fixtures/counter';
import { todos } from '../fixtures/todos';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngc-spec-child-component',
  template: `
  
  `
})
export class NgcSpecChildComponent { }

@NgModule({
  imports: [
    StoreModule.forFeature('feature', { todos: todos })
  ],
  declarations: [
    NgcSpecChildComponent,
  ],
  exports: [
    NgcSpecChildComponent,
  ]
})
export class FeatureModule { }

export interface AppState {
  count: number;
}

@Component({
  selector: 'ngc-spec-component',
  template: `
    <button (click)="increment()"> + </button>
    <span>  Count : {{ count | async }}  </span>
    <button (click)="decrement()"> + </button>

    <ngc-spec-child-component></ngc-spec-child-component>
  `
})
export class NgcSpecComponent {
  count: Observable<number>;
  constructor(public store:Store<AppState>){
    this.count = store.select(state => state.count);
  }
  increment(){
    this.store.dispatch({ type: INCREMENT });
  }
  decrement(){
    this.store.dispatch({ type: DECREMENT });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ count: counterReducer }, {
      initialState: { count : 0 },
      reducerFactory: combineReducers
    }),
    FeatureModule
  ],
  declarations: [NgcSpecComponent],
  bootstrap: [NgcSpecComponent]
})
export class NgcSpecModule {}
