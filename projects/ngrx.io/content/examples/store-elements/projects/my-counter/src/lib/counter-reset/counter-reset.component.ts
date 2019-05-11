import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Reset } from '../counter.actions';

@Component({
  selector: 'app-counter-reset',
  templateUrl: './counter-reset.component.html',
  styleUrls: ['./counter-reset.component.css']
})
export class CounterResetComponent implements OnInit {

  constructor(private store: Store<{ count: number }>) { }

  ngOnInit() {
  }

  reset() {
    this.store.dispatch(new Reset());
  }
}
