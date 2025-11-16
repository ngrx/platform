import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type } from '@ngrx/signals';
import {
  Dispatcher,
  event,
  EventInstance,
  Events,
  provideDispatcher,
} from '../src';
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

  it('receives dispatched events from ancestor Events services', () => {
    const parentInjector = Injector.create({
      providers: [provideDispatcher()],
      parent: TestBed.inject(Injector),
    });
    const childInjector = Injector.create({
      providers: [provideDispatcher()],
      parent: parentInjector,
    });

    const globalEvents = TestBed.inject(Events);
    const parentEvents = parentInjector.get(Events);
    const childEvents = childInjector.get(Events);
    const childDispatcher = childInjector.get(Dispatcher);

    const foo = event('foo', type<string>());

    const globalResult: string[] = [];
    const parentResult: string[] = [];
    const childResult: string[] = [];

    globalEvents.on(foo).subscribe(({ payload }) => globalResult.push(payload));
    parentEvents.on(foo).subscribe(({ payload }) => parentResult.push(payload));
    childEvents.on(foo).subscribe(({ payload }) => childResult.push(payload));

    childDispatcher.dispatch(foo('self by default'));
    childDispatcher.dispatch(foo('explicit self'), { scope: 'self' });
    childDispatcher.dispatch(foo('parent'), { scope: 'parent' });
    childDispatcher.dispatch(foo('global'), { scope: 'global' });

    expect(globalResult).toEqual(['global']);
    expect(parentResult).toEqual(['parent', 'global']);
    expect(childResult).toEqual([
      'self by default',
      'explicit self',
      'parent',
      'global',
    ]);
  });
});
