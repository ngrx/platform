import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockState<T> extends BehaviorSubject<T> {
  /**
   * @internal
   */
  readonly state: Signal<T>;

  constructor() {
    super(<T>{});

    this.state = toSignal(this, { manualCleanup: true, requireSync: true });
  }
}
