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
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      {
        type: '[Counter Page] increment',
        payload: undefined,
      },
      { scope: 'self' }
    );

    dispatch.set({ count: 10 });
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      {
        type: '[Counter Page] set',
        payload: { count: 10 },
      },
      { scope: 'self' }
    );
  });

  it('creates self-dispatching events with a custom scope', () => {
    const usersPageEvents = eventGroup({
      source: 'Users Page',
      events: {
        opened: type<void>(),
        queryChanged: type<string>(),
        paginationChanged: type<{ currentPage: number; pageSize: number }>(),
      },
    });
    const dispatcher = TestBed.inject(Dispatcher);
    const dispatch = TestBed.runInInjectionContext(() =>
      injectDispatch(usersPageEvents)
    );
    vitest.spyOn(dispatcher, 'dispatch');

    dispatch({ scope: 'self' }).opened();
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      {
        type: '[Users Page] opened',
        payload: undefined,
      },
      { scope: 'self' }
    );

    dispatch({ scope: 'parent' }).queryChanged('ngrx');
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      {
        type: '[Users Page] queryChanged',
        payload: 'ngrx',
      },
      { scope: 'parent' }
    );

    dispatch({ scope: 'global' }).paginationChanged({
      currentPage: 10,
      pageSize: 100,
    });
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      {
        type: '[Users Page] paginationChanged',
        payload: { currentPage: 10, pageSize: 100 },
      },
      { scope: 'global' }
    );
  });

  it('allows defining event names equal to predefined function properties', () => {
    const fooEvents = eventGroup({
      source: 'foo',
      events: {
        name: type<boolean>(),
        toString: type<{ bar: number }>(),
      },
    });

    const dispatcher = TestBed.inject(Dispatcher);
    const dispatch = TestBed.runInInjectionContext(() =>
      injectDispatch(fooEvents)
    );
    vitest.spyOn(dispatcher, 'dispatch');

    dispatch.name(true);
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      { type: '[foo] name', payload: true },
      { scope: 'self' }
    );

    dispatch({ scope: 'parent' }).name(false);
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      { type: '[foo] name', payload: false },
      { scope: 'parent' }
    );

    dispatch.toString({ bar: 10 });
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      { type: '[foo] toString', payload: { bar: 10 } },
      { scope: 'self' }
    );

    dispatch({ scope: 'global' }).toString({ bar: 100 });
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      { type: '[foo] toString', payload: { bar: 100 } },
      { scope: 'global' }
    );
  });

  it('creates self-dispatching events with a custom injector', () => {
    const increment = event('increment');
    const injector = TestBed.inject(EnvironmentInjector);
    const dispatcher = TestBed.inject(Dispatcher);
    const dispatch = injectDispatch({ increment }, { injector });
    vitest.spyOn(dispatcher, 'dispatch');

    dispatch.increment();
    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      { type: 'increment', payload: undefined },
      { scope: 'self' }
    );
  });

  it('throws an error when called outside of an injection context', () => {
    const increment = event('increment');

    expect(() => injectDispatch({ increment })).toThrowError(
      'injectDispatch() can only be used within an injection context'
    );
  });
});
