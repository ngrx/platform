import { EventCreator, eventCreator, props } from '../src';

describe('eventCreator', () => {
  it('creates an event creator without additional properties', () => {
    const increment = eventCreator('increment');
    const event = increment();

    expect(event).toEqual({ type: 'increment' });
  });

  it('creates an event creator with additional properties', () => {
    const set = eventCreator('set', props<{ count: number }>());
    const event = set({ count: 10 });

    expect(event).toEqual({ type: 'set', count: 10 });
  });

  it('displays a warning when event props are an array', () => {
    const set = eventCreator('set', props<number[]>());
    vitest.spyOn(console, 'warn').mockImplementation(() => {});

    set([1, 2, 3]);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals/events: Event props cannot be an array.'
    );
  });

  it('displays a warning when event props contain a type property', () => {
    const set = eventCreator('set', props<{ type: number }>());
    vitest.spyOn(console, 'warn').mockImplementation(() => {});

    set({ type: 10 });

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals/events: Event props cannot contain a type property.'
    );
  });

  it('allows creating custom event creator factories', () => {
    function formattedEventCreator<Source extends string, Event extends string>(
      source: Source,
      event: Event
    ): EventCreator<`[${Source}] ${Event}`> {
      return eventCreator(`[${source}] ${event}`);
    }

    const increment = formattedEventCreator('Counter Page', 'Increment');
    const event = increment();

    expect(event).toEqual({ type: '[Counter Page] Increment' });
  });
});
