import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type } from '@ngrx/signals';
import { Dispatcher, event, eventGroup, injectDispatch } from '../src';

describe('injectDispatch', () => {
  it('creates self-dispatching events', () => {
    const counterPageEvents = eventGroup({
      source: 'Counter Page',
      events: {
        increment: type<void>(),
        set: type<{ count: number }>(),
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
      payload: { count: 10 },
    });
  });

  it('creates self-dispatching events with a custom injector', () => {
    const increment = event('increment');
    const injector = TestBed.inject(EnvironmentInjector);
    const dispatcher = TestBed.inject(Dispatcher);
    const dispatch = injectDispatch({ increment }, { injector });
    vitest.spyOn(dispatcher, 'dispatch');

    dispatch.increment();
    expect(dispatcher.dispatch).toHaveBeenCalledWith({ type: 'increment' });
  });

  it('throws an error when called outside of an injection context', () => {
    const increment = event('increment');

    expect(() => injectDispatch({ increment })).toThrowError(
      'injectDispatch() can only be used within an injection context'
    );
  });
});
