import { computed, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { map, tap } from 'rxjs';
import { signalStore, withComputed, withProps, withState } from '@ngrx/signals';
import {
  Dispatcher,
  Event,
  eventCreator,
  Events,
  props,
  withEffects,
} from '../src';
import { createLocalService } from '../../spec/helpers';

describe('withEffects', () => {
  const event1 = eventCreator('event1');
  const event2 = eventCreator('event2');
  const event3 = eventCreator('event3', props<{ value: string }>());
  const event4 = eventCreator('event4', props<{ value: string }>());

  it('has access to SignalStore state slices and props', () => {
    const values: string[] = [];

    const Store = signalStore(
      { providedIn: 'root' },
      withState({ foo: 'foo' }),
      withComputed(({ foo }) => ({
        bar: computed(() => `${foo()} bar`),
      })),
      withProps(() => ({ baz: 'baz' })),
      withEffects(({ foo, bar, baz }) => {
        values.push(foo(), bar(), baz);
        return {};
      })
    );

    TestBed.inject(Store);

    expect(values).toEqual(['foo', 'foo bar', 'baz']);
  });

  it('dispatches events returned by effects', () => {
    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events
          .on(event1, event2)
          .pipe(map(({ type }) => event3({ value: type }))),
        $$: events.on(event3).pipe(map(({ value }) => event4({ value }))),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const emittedEvents: Event[] = [];

    events.on().subscribe((event) => emittedEvents.push(event));
    TestBed.inject(Store);

    dispatcher.dispatch(event1());
    dispatcher.dispatch(event2());

    expect(emittedEvents).toEqual([
      { type: 'event1' },
      { type: 'event3', value: 'event1' },
      { type: 'event4', value: 'event1' },
      { type: 'event2' },
      { type: 'event3', value: 'event2' },
      { type: 'event4', value: 'event2' },
    ]);
  });

  it('does not dispatch the source event when an effect does not return a new event', () => {
    const Store = signalStore(
      { providedIn: 'root' },
      withEffects((_, events = inject(Events)) => ({
        $: events.on(event1).pipe(tap(() => {})),
        $$: events.on(event2).pipe(tap(() => {})),
      }))
    );

    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const emittedEvents: Event[] = [];

    events.on().subscribe((event) => emittedEvents.push(event));
    TestBed.inject(Store);

    dispatcher.dispatch(event1());
    dispatcher.dispatch(event2());

    expect(emittedEvents).toEqual([{ type: 'event1' }, { type: 'event2' }]);
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
