import { type } from '@ngrx/signals';
import { event, EventCreator } from '../src';

describe('event', () => {
  it('creates an event creator without payload', () => {
    const increment = event('increment');
    expect(increment()).toEqual({ type: 'increment' });
  });

  it('creates an event creator with payload', () => {
    const set = event('set', type<{ count: number }>());
    expect(set({ count: 10 })).toEqual({ type: 'set', payload: { count: 10 } });
  });

  it('allows creating custom event creator factories', () => {
    function formattedEventCreator<Source extends string, Event extends string>(
      source: Source,
      eventName: Event
    ): EventCreator<`[${Source}] ${Event}`, void> {
      return event(`[${source}] ${eventName}`);
    }

    const increment = formattedEventCreator('Counter Page', 'Increment');
    expect(increment()).toEqual({ type: '[Counter Page] Increment' });
  });
});
