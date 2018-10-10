import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MockState<T extends {}> extends BehaviorSubject<T> {
  constructor() {
    super(<T>{});
  }
}
