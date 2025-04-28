import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Dispatcher,
  emptyProps,
  eventCreator,
  eventCreatorGroup,
  injectDispatch,
  props,
} from '../src';

describe('injectDispatch', () => {
  it('creates self-dispatching events', () => {
    const counterPageEvents = eventCreatorGroup({
      source: 'Counter Page',
      events: {
        increment: emptyProps(),
        set: props<{ count: number }>(),
      },
    });
    const dispatcher = TestBed.inject(Dispatcher);
    const dispatch = TestBed.runInInjectionContext(() =>
      injectDispatch(counterPageEvents)
    );
    vitest.spyOn(dispatcher, 'dispatch');

    dispatch.increment();
    expect(dispatcher.dispatch).toHaveBeenCalledWith({
      type: '[Counter Page] increment',
    });

    dispatch.set({ count: 10 });
    expect(dispatcher.dispatch).toHaveBeenCalledWith({
      type: '[Counter Page] set',
      count: 10,
    });
  });

  it('creates self-dispatching events with a custom injector', () => {
    const increment = eventCreator('increment');
    const injector = TestBed.inject(EnvironmentInjector);
    const dispatcher = TestBed.inject(Dispatcher);
    const dispatch = injectDispatch({ increment }, { injector });
    vitest.spyOn(dispatcher, 'dispatch');

    dispatch.increment();
    expect(dispatcher.dispatch).toHaveBeenCalledWith({ type: 'increment' });
  });

  it('throws an error when called outside of an injection context', () => {
    const increment = eventCreator('increment');

    expect(() => injectDispatch({ increment })).toThrowError(
      'injectDispatch() can only be used within an injection context'
    );
  });
});
