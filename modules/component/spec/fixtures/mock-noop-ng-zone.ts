import { MockEventEmitter } from './mock-event-emitter';

/**
 * source: https://github.com/angular/angular/blob/master/packages/core/src/zone/ng_zone.ts#L88
 */
export class MockNoopNgZone {
  readonly hasPendingMacrotasks: boolean = false;
  readonly hasPendingMicrotasks: boolean = false;
  readonly isStable: boolean = true;
  readonly onUnstable: MockEventEmitter<any> = new MockEventEmitter(false);
  readonly onMicrotaskEmpty: MockEventEmitter<any> = new MockEventEmitter(
    false
  );
  readonly onStable: MockEventEmitter<any> = new MockEventEmitter(false);
  readonly onError: MockEventEmitter<any> = new MockEventEmitter(false);

  static isInAngularZone(): boolean {
    return true;
  }

  static assertInAngularZone(): void {}

  static assertNotInAngularZone(): void {}

  constructor({
    enableLongStackTrace = false,
    shouldCoalesceEventChangeDetection = false,
  }) {}

  run(fn: Function): any {
    return fn();
  }

  runTask<T>(
    fn: (...args: any[]) => T,
    applyThis?: any,
    applyArgs?: any[],
    name?: string
  ): T {
    return {} as any;
  }

  runGuarded<T>(
    fn: (...args: any[]) => T,
    applyThis?: any,
    applyArgs?: any[]
  ): T {
    return {} as any;
  }

  runOutsideAngular(fn: Function): any {
    return fn();
  }
}
