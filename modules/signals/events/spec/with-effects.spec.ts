import { computed, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { map, tap } from 'rxjs';
import {
  getState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  Dispatcher,
  event,
  EventInstance,
  Events,
  mapToScope,
  toScope,
  withEffects,
} from '../src';
import { createLocalService } from '../../spec/helpers';

describe('withEffects', () => {
  const event1 = event('event1');
  const event2 = event('event2');
  const event3 = event('event3', type<string>());
  const event4 = event('event4', type<{ value: string }>());

  it('has access to SignalStore state slices, props, methods, and state source', () => {
    const values: string[] = [];

    const Store = signalStore(
      { providedIn: 'root' },
      withState({ k: 'k' }),
      withComputed(({ k }) => ({
        l: computed(() => `${k()} l`),
      })),
      withProps(() => ({ m: 'm' })),
      withMethods(() => ({
        n(): string {
          return 'n';
        },
      })),
      withEffects(({ k, l, m, n, ...store }) => {
        values.push(k(), l(), m, n(), getState(store).k);
        return {};
      })
    );

    TestBed.inject(Store);

    expect(values).toEqual(['k', 'k l', 'm', 'n', 'k']);
  });

  it('dispatches events returned by effects', () => {
    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1, event2).pipe(map(({ type }) => event3(type))),
        $$: events
          .on(event3)
          .pipe(map(({ payload }) => event4({ value: payload }))),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const emittedEvents: EventInstance<string, unknown>[] = [];

    events.on().subscribe((event) => emittedEvents.push(event));
    TestBed.inject(Store);

    dispatcher.dispatch(event1());
    dispatcher.dispatch(event2());

    expect(emittedEvents).toEqual([
      { type: 'event1' },
      { type: 'event3', payload: 'event1' },
      { type: 'event4', payload: { value: 'event1' } },
      { type: 'event2' },
      { type: 'event3', payload: 'event2' },
      { type: 'event4', payload: { value: 'event2' } },
    ]);
  });

  it('does not re-dispatch the same event when an effect does not return a new event', () => {
    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1).pipe(tap(() => {})),
        $$: events.on(event2).pipe(tap(() => {})),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const emittedEvents: EventInstance<string, unknown>[] = [];

    events.on().subscribe((event) => emittedEvents.push(event));
    TestBed.inject(Store);

    dispatcher.dispatch(event1());
    dispatcher.dispatch(event2());

    expect(emittedEvents).toEqual([{ type: 'event1' }, { type: 'event2' }]);
  });

  it('re-dispatches the same event when it is explicitly returned from an effect', () => {
    let executionCount = 0;

    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1).pipe(
          map(() => (executionCount < 2 ? event1() : null)),
          tap(() => executionCount++)
        ),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const emittedEvents: EventInstance<string, unknown>[] = [];

    events.on().subscribe((event) => emittedEvents.push(event));
    TestBed.inject(Store);

    dispatcher.dispatch(event1());

    expect(emittedEvents).toEqual([
      { type: 'event1' },
      { type: 'event1' },
      { type: 'event1' },
    ]);
  });

  it('dispatches an event with provided scope via toScope', () => {
    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1).pipe(map(() => [event2(), toScope('parent')])),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    vitest.spyOn(dispatcher, 'dispatch');

    TestBed.inject(Store);

    dispatcher.dispatch(event1());
    expect(dispatcher.dispatch).toHaveBeenCalledWith(event2(), {
      scope: 'parent',
    });
  });

  it('dispatches an event with provided scope via mapToScope', () => {
    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1).pipe(
          map(() => event3('ngrx')),
          mapToScope('global')
        ),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    vitest.spyOn(dispatcher, 'dispatch');

    TestBed.inject(Store);

    dispatcher.dispatch(event1());
    expect(dispatcher.dispatch).toHaveBeenCalledWith(event3('ngrx'), {
      scope: 'global',
    });
  });

  it('unsubscribes from effects when the store is destroyed', () => {
    let executionCount = 0;

    const Store = signalStore(
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1).pipe(tap(() => executionCount++)),
      }))
    );

    const { destroy } = createLocalService(Store);
    const dispatcher = TestBed.inject(Dispatcher);

    expect(executionCount).toBe(0);

    dispatcher.dispatch(event1());
    expect(executionCount).toBe(1);

    destroy();

    dispatcher.dispatch(event1());
    expect(executionCount).toBe(1);
  });
});
