import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Decrement } from '../counter.actions';

@Component({
  selector: 'app-counter-decrement',
  templateUrl: './counter-decrement.component.html'
})
export class CounterDecrementComponent {

  constructor(private store: Store<{ count: number }>) { }

  decrement() {
    this.store.dispatch(new Decrement());
  }

}
