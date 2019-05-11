  import { Component, OnInit } from '@angular/core';

  import { Store } from '@ngrx/store';
  import { Decrement } from '../counter.actions';

  @Component({
    selector: 'app-counter-decrement',
    templateUrl: './counter-decrement.component.html',
    styleUrls: ['./counter-decrement.component.css']
  })
  export class CounterDecrementComponent implements OnInit {

    constructor(private store: Store<{ count: number }>) { }

    ngOnInit() {
    }

    decrement() {
      this.store.dispatch(new Decrement());
    }

  }
