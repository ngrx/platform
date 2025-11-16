import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';
import { type } from '@ngrx/signals';
import {
  Dispatcher,
  event,
  Events,
  provideDispatcher,
  ReducerEvents,
} from '../src';
import { EVENTS } from '../src/events-service';

describe('Dispatcher', () => {
  it('is provided globally', () => {
    const dispatcher = TestBed.inject(Dispatcher);
    expect(dispatcher).toBeDefined();
  });

  it('emits dispatched events to the ReducerEvents service before the Events service', () => {
    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const reducerEvents = TestBed.inject(ReducerEvents);
    const set = event('set', type<number>());
    const result: Array<ReturnType<typeof set> & { order: number }> = [];

    events
      .on(set)
      .pipe(take(1))
      .subscribe((event) => result.push({ ...event, order: 2 }));
    reducerEvents
      .on(set)
      .pipe(take(1))
      .subscribe((event) => result.push({ ...event, order: 1 }));

    dispatcher.dispatch(set(10));

    expect(result).toEqual([
      { type: 'set', payload: 10, order: 1 },
      { type: 'set', payload: 10, order: 2 },
    ]);
  });

  describe('hierarchical dispatchers', () => {
    function setup() {
      const parentInjector = Injector.create({
        providers: [provideDispatcher()],
        parent: TestBed.inject(Injector),
      });
      const childInjector = Injector.create({
        providers: [provideDispatcher()],
        parent: parentInjector,
      });

      const globalDispatcher = TestBed.inject(Dispatcher);
      const parentDispatcher = parentInjector.get(Dispatcher);
      const childDispatcher = childInjector.get(Dispatcher);

      const globalEvents = TestBed.inject(Events)[EVENTS];
      const parentEvents = parentInjector.get(Events)[EVENTS];
      const childEvents = childInjector.get(Events)[EVENTS];

      vitest.spyOn(globalDispatcher, 'dispatch');
      vitest.spyOn(parentDispatcher, 'dispatch');
      vitest.spyOn(globalEvents, 'next');
      vitest.spyOn(parentEvents, 'next');
      vitest.spyOn(childEvents, 'next');

      return {
        globalDispatcher,
        parentDispatcher,
        childDispatcher,
        globalEvents,
        parentEvents,
        childEvents,
      };
    }

    it('dispatches an event to the local dispatcher by default', () => {
      const {
        globalDispatcher,
        parentDispatcher,
        childDispatcher,
        globalEvents,
        parentEvents,
        childEvents,
      } = setup();
      const increment = event('increment');

      childDispatcher.dispatch(increment());

      expect(childEvents.next).toHaveBeenCalledWith(increment());
      expect(parentEvents.next).not.toHaveBeenCalled();
      expect(globalEvents.next).not.toHaveBeenCalled();
      expect(parentDispatcher.dispatch).not.toHaveBeenCalled();
      expect(globalDispatcher.dispatch).not.toHaveBeenCalled();
    });

    it('dispatches an event to the local dispatcher when scope is self', () => {
      const {
        globalDispatcher,
        parentDispatcher,
        childDispatcher,
        globalEvents,
        parentEvents,
        childEvents,
      } = setup();
      const increment = event('increment');

      childDispatcher.dispatch(increment(), { scope: 'self' });

      expect(childEvents.next).toHaveBeenCalledWith(increment());
      expect(parentEvents.next).not.toHaveBeenCalled();
      expect(globalEvents.next).not.toHaveBeenCalled();
      expect(parentDispatcher.dispatch).not.toHaveBeenCalled();
      expect(globalDispatcher.dispatch).not.toHaveBeenCalled();
    });

    it('dispatches an event to the parent dispatcher when scope is parent', () => {
      const {
        globalDispatcher,
        parentDispatcher,
        childDispatcher,
        globalEvents,
        parentEvents,
        childEvents,
      } = setup();
      const increment = event('increment');

      childDispatcher.dispatch(increment(), { scope: 'parent' });

      expect(childEvents.next).not.toHaveBeenCalled();
      expect(parentEvents.next).toHaveBeenCalledWith(increment());
      expect(globalEvents.next).not.toHaveBeenCalled();
      expect(parentDispatcher.dispatch).toHaveBeenCalledWith(
        increment(),
        undefined
      );
      expect(globalDispatcher.dispatch).not.toHaveBeenCalled();
    });

    it('dispatches an event to the parent dispatcher when scope is global', () => {
      const {
        globalDispatcher,
        parentDispatcher,
        childDispatcher,
        globalEvents,
        parentEvents,
        childEvents,
      } = setup();
      const increment = event('increment');

      childDispatcher.dispatch(increment(), { scope: 'global' });

      expect(childEvents.next).not.toHaveBeenCalled();
      expect(parentEvents.next).not.toHaveBeenCalled();
      expect(globalEvents.next).toHaveBeenCalledWith(increment());
      expect(parentDispatcher.dispatch).toHaveBeenCalledWith(increment(), {
        scope: 'global',
      });
      expect(globalDispatcher.dispatch).toHaveBeenCalledWith(increment(), {
        scope: 'global',
      });
    });
  });
});
