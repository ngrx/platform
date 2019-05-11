import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Increment} from '../counter.actions';

@Component({
  selector: 'app-counter-increment',
  templateUrl: './counter-increment.component.html',
  styleUrls: ['./counter-increment.component.css']
})
export class CounterIncrementComponent implements OnInit {

  constructor(private store: Store<{ count: number }>) { }

  ngOnInit() {
  }

  increment() {
    this.store.dispatch(new Increment());
  }

}
