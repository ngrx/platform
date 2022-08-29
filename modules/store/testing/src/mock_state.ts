import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockState<T> extends BehaviorSubject<T> {
  constructor() {
    super(<T>{});
  }
}
