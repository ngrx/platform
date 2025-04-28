import { type } from '@ngrx/signals';
import {
  emptyProps,
  EventCreator,
  eventCreatorGroup,
  EventCreatorWithProps,
  props,
} from '../src';

describe('eventCreatorGroup', () => {
  it('creates an event creator group', () => {
    const counterPageEvents = eventCreatorGroup({
      source: 'Counter Page',
      events: {
        increment: emptyProps(),
        decrement: emptyProps(),
        set: props<{ count: number }>(),
      },
    });

    const incrementEvent = counterPageEvents.increment();
    const decrementEvent = counterPageEvents.decrement();
    const setEvent = counterPageEvents.set({ count: 10 });

    expect(incrementEvent).toEqual({ type: '[Counter Page] increment' });
    expect(decrementEvent).toEqual({ type: '[Counter Page] decrement' });
    expect(setEvent).toEqual({ type: '[Counter Page] set', count: 10 });
  });

  it('allows creating custom event creator group factories', () => {
    function apiEventCreatorGroup<Source extends string, Entity>(
      source: Source,
      _entity: Entity
    ): {
      loadedSuccess: EventCreatorWithProps<
        `[${Source} API] loadedSuccess`,
        { entities: Entity[] }
      >;
      loadedFailure: EventCreator<`[${Source} API] loadedFailure`>;
    } {
      return eventCreatorGroup({
        source: `${source} API`,
        events: {
          loadedSuccess: props<{ entities: Entity[] }>(),
          loadedFailure: emptyProps(),
        },
      });
    }

    type User = { id: number; name: string };
    const usersApiEvents = apiEventCreatorGroup('Users', type<User>());

    const loadedSuccessEvent = usersApiEvents.loadedSuccess({
      entities: [{ id: 1, name: 'John Doe' }],
    });
    const loadedFailureEvent = usersApiEvents.loadedFailure();

    expect(loadedSuccessEvent).toEqual({
      type: '[Users API] loadedSuccess',
      entities: [{ id: 1, name: 'John Doe' }],
    });
    expect(loadedFailureEvent).toEqual({ type: '[Users API] loadedFailure' });
  });
});
