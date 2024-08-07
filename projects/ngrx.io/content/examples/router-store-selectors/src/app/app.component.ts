import { Component, OnInit } from '@angular/core';
import { appInit } from './car/car.actions';
import { selectCars } from './car/car.selectors';
import { Store } from '@ngrx/store';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NgIf, NgFor, AsyncPipe, RouterLink],
})
export class AppComponent implements OnInit {
  cars$ = this.store.select(selectCars);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(
      appInit({
        cars: [
          { id: '1', make: 'ford', model: 'mustang', year: '2005' },
          { id: '2', make: 'ford', model: 'mustang', year: '1987' },
          { id: '3', make: 'ford', model: 'mustang', year: '1976' },
        ],
      })
    );
  }
}
