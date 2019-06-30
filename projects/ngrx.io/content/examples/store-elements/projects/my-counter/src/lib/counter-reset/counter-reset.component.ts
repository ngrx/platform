import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Reset } from '../counter.actions';

@Component({
  selector: 'app-counter-reset',
  templateUrl: './counter-reset.component.html'
})
export class CounterResetComponent {

  constructor(private store: Store<{ count: number }>) { }

  reset() {
    this.store.dispatch(new Reset());
  }
}
