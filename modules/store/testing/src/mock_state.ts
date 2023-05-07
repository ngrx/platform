import { Injectable, Signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockState<T> extends BehaviorSubject<T> {
  /**
   * @internal
   */
  state!: Signal<T | undefined>;

  constructor() {
    super(<T>{});
  }
}
