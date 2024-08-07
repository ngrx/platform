// #docregion carComponent
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCar } from './car.selectors';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  imports: [AsyncPipe, JsonPipe],
})
export class CarComponent {
  car$ = this.store.select(selectCar);

  constructor(private store: Store) {}
}
// #enddocregion carComponent
