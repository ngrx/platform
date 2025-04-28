import { TestBed } from '@angular/core/testing';
import { Dispatcher, Event, eventCreator, Events, props } from '../src';
import { SOURCE_TYPE } from '../src/events';

describe('Events', () => {
  it('is provided at the root level', () => {
    const events = TestBed.inject(Events);
    expect(events).toBeDefined();
  });

  describe('on', () => {
    const foo = eventCreator('foo');
    const bar = eventCreator('bar', props<{ value: number }>());
    const baz = eventCreator('baz');

    it('emits events matching the provided event creators', () => {
      const events = TestBed.inject(Events);
      const dispatcher = TestBed.inject(Dispatcher);
      const emittedEvents: Event[] = [];

      events.on(foo, bar).subscribe((event) => emittedEvents.push(event));

      dispatcher.dispatch(bar({ value: 10 }));
      dispatcher.dispatch(foo());
      dispatcher.dispatch(baz());
      dispatcher.dispatch(bar({ value: 100 }));

      expect(emittedEvents).toEqual([
        { type: 'bar', value: 10 },
        { type: 'foo' },
        { type: 'bar', value: 100 },
      ]);
    });

    it('emits all events when called without arguments', () => {
      const events = TestBed.inject(Events);
      const dispatcher = TestBed.inject(Dispatcher);
      const emittedEvents: Event[] = [];

      events.on().subscribe((event) => emittedEvents.push(event));

      dispatcher.dispatch(foo());
      dispatcher.dispatch(bar({ value: 10 }));
      dispatcher.dispatch(baz());
      dispatcher.dispatch(foo());

      expect(emittedEvents).toEqual([
        { type: 'foo' },
        { type: 'bar', value: 10 },
        { type: 'baz' },
        { type: 'foo' },
      ]);
    });

    it('adds SOURCE_TYPE to emitted events', () => {
      const events = TestBed.inject(Events);
      const dispatcher = TestBed.inject(Dispatcher);
      const sourceTypes: string[] = [];

      events
        .on()
        .subscribe((event) => sourceTypes.push((event as any)[SOURCE_TYPE]));

      dispatcher.dispatch(foo());
      dispatcher.dispatch(bar({ value: 10 }));

      expect(sourceTypes).toEqual(['foo', 'bar']);
    });
  });
});
