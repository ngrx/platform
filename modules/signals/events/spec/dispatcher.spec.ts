import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';
import { Dispatcher, eventCreator, Events, props } from '../src';
import { ReducerEvents } from '../src/events';

describe('Dispatcher', () => {
  it('is provided at the root level', () => {
    const dispatcher = TestBed.inject(Dispatcher);
    expect(dispatcher).toBeDefined();
  });

  it('emits dispatched events to the ReducerEvents service before the Events service', () => {
    const dispatcher = TestBed.inject(Dispatcher);
    const events = TestBed.inject(Events);
    const reducerEvents = TestBed.inject(ReducerEvents);
    const set = eventCreator('set', props<{ count: number }>());
    const result: Array<ReturnType<typeof set> & { order: number }> = [];

    events
      .on(set)
      .pipe(take(1))
      .subscribe((event) => result.push({ ...event, order: 2 }));
    reducerEvents
      .on(set)
      .pipe(take(1))
      .subscribe((event) => result.push({ ...event, order: 1 }));

    dispatcher.dispatch(set({ count: 10 }));

    expect(result).toEqual([
      { type: 'set', count: 10, order: 1 },
      { type: 'set', count: 10, order: 2 },
    ]);
  });

  it('displays a warning when event creator is dispatched', () => {
    const dispatcher = TestBed.inject(Dispatcher);
    const increment = eventCreator('increment');
    vitest.spyOn(console, 'warn').mockImplementation(() => {});

    dispatcher.dispatch(increment);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals/events: Event creator should not be dispatched.',
      'Did you forget to call it?'
    );
  });
});
