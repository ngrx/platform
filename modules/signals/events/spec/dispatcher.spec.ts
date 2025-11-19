import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';
import { type } from '@ngrx/signals';
import { Dispatcher, event, Events } from '../src';
import { ReducerEvents } from '../src/events-service';

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
});
