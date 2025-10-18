import { TestBed } from '@angular/core/testing';
import { type } from '@ngrx/signals';
import { Dispatcher, event, EventInstance, Events } from '../src';
import { SOURCE_TYPE } from '../src/events-service';

describe('Events', () => {
  it('is provided globally', () => {
    const events = TestBed.inject(Events);
    expect(events).toBeDefined();
  });

  describe('on', () => {
    const foo = event('foo');
    const bar = event('bar', type<{ value: number }>());
    const baz = event('baz');

    it('emits events matching the provided event creators', () => {
      const events = TestBed.inject(Events);
      const dispatcher = TestBed.inject(Dispatcher);
      const emittedEvents: EventInstance<string, unknown>[] = [];

      events.on(foo, bar).subscribe((event) => emittedEvents.push(event));

      dispatcher.dispatch(bar({ value: 10 }));
      dispatcher.dispatch(foo());
      dispatcher.dispatch(baz());
      dispatcher.dispatch(bar({ value: 100 }));

      expect(emittedEvents).toEqual([
        { type: 'bar', payload: { value: 10 } },
        { type: 'foo' },
        { type: 'bar', payload: { value: 100 } },
      ]);
    });

    it('emits all events when called without arguments', () => {
      const events = TestBed.inject(Events);
      const dispatcher = TestBed.inject(Dispatcher);
      const emittedEvents: EventInstance<string, unknown>[] = [];

      events.on().subscribe((event) => emittedEvents.push(event));

      dispatcher.dispatch(foo());
      dispatcher.dispatch(bar({ value: 10 }));
      dispatcher.dispatch(baz());
      dispatcher.dispatch(foo());

      expect(emittedEvents).toEqual([
        { type: 'foo' },
        { type: 'bar', payload: { value: 10 } },
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
