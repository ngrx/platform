import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Increment } from '../counter.actions';

@Component({
  selector: 'app-counter-increment',
  templateUrl: './counter-increment.component.html'
})
export class CounterIncrementComponent {

  constructor(private store: Store<{ count: number }>) { }

  increment() {
    this.store.dispatch(new Increment());
  }

}
