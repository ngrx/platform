import { type } from '@ngrx/signals';
import { EventCreator, eventGroup } from '../src';

describe('eventGroup', () => {
  it('creates a group of event creators', () => {
    const counterPageEvents = eventGroup({
      source: 'Counter Page',
      events: {
        increment: type<void>(),
        decrement: type<void>(),
        set: type<number>(),
      },
    });

    const incrementEvent = counterPageEvents.increment();
    const decrementEvent = counterPageEvents.decrement();
    const setEvent = counterPageEvents.set(10);

    expect(incrementEvent).toEqual({ type: '[Counter Page] increment' });
    expect(decrementEvent).toEqual({ type: '[Counter Page] decrement' });
    expect(setEvent).toEqual({ type: '[Counter Page] set', payload: 10 });
  });

  it('allows creating custom event group factories', () => {
    function apiEventGroup<Source extends string, Entity>(
      source: Source,
      _entity: Entity
    ): {
      loadedSuccess: EventCreator<`[${Source} API] loadedSuccess`, Entity[]>;
      loadedFailure: EventCreator<`[${Source} API] loadedFailure`, void>;
    } {
      return eventGroup({
        source: `${source} API`,
        events: {
          loadedSuccess: type<Entity[]>(),
          loadedFailure: type<void>(),
        },
      });
    }

    type User = { id: number; name: string };
    const usersApiEvents = apiEventGroup('Users', type<User>());

    const loadedSuccessEvent = usersApiEvents.loadedSuccess([
      { id: 1, name: 'John Doe' },
    ]);
    const loadedFailureEvent = usersApiEvents.loadedFailure();

    expect(loadedSuccessEvent).toEqual({
      type: '[Users API] loadedSuccess',
      payload: [{ id: 1, name: 'John Doe' }],
    });
    expect(loadedFailureEvent).toEqual({ type: '[Users API] loadedFailure' });
  });
});
