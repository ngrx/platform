import { Component, OnInit, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {

  count$: Observable<number>;

  constructor(private store: Store<{ count: number }>) {

  }

  ngOnInit() {
    this.count$ = this.store.pipe(select('count'));
  }
}
