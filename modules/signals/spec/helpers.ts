import { Component, inject, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SignalsDictionary } from '../src/signal-store-models';

export function createLocalService<Service extends Type<unknown>>(
  serviceToken: Service
): {
  service: InstanceType<Service>;
  flush: () => void;
  destroy: () => void;
} {
  @Component({
    template: '',
    providers: [serviceToken],
  })
  class TestComponent {
    service = inject(serviceToken);
  }

  const fixture = TestBed.configureTestingModule({
    imports: [TestComponent],
  }).createComponent(TestComponent);
  fixture.detectChanges();

  return {
    service: fixture.componentInstance.service,
    flush: () => {
      TestBed.tick();
      fixture.detectChanges();
    },
    destroy: () => fixture.destroy(),
  };
}

/**
 * This could be done by using `getState`, but
 * 1. We don't want to depend on the implementation of `getState` in the test.
 * 2. We want to be able to provide the state in its actual type (with slice signals).
 */
export function assertStateSource(
  state: SignalsDictionary,
  expected: SignalsDictionary
): void {
  const stateKeys = Reflect.ownKeys(state);
  const expectedKeys = Reflect.ownKeys(expected);

  const currentState = stateKeys.reduce((acc, key) => {
    acc[key] = state[key]();
    return acc;
  }, {} as Record<string | symbol, unknown>);
  const expectedState = expectedKeys.reduce((acc, key) => {
    acc[key] = expected[key]();
    return acc;
  }, {} as Record<string | symbol, unknown>);
  expect(currentState).toEqual(expectedState);
}
