import { Prettify } from '@ngrx/signals';
import {
  eventCreator,
  EventCreator,
  EventCreatorWithProps,
} from './event-creator';

type EventType<
  Source extends string,
  EventName extends string
> = `[${Source}] ${EventName}`;

type EventCreatorGroup<
  Source extends string,
  Events extends Record<string, object | undefined>
> = {
  [EventName in keyof Events]: EventName extends string
    ? undefined extends Events[EventName]
      ? EventCreator<EventType<Source, EventName>>
      : Events[EventName] extends object
      ? EventCreatorWithProps<EventType<Source, EventName>, Events[EventName]>
      : never
    : never;
};

/**
 * @experimental
 * @description
 *
 * Creates a group of event creators.
 *
 * @usageNotes
 *
 * ```ts
 * import { emptyProps, eventCreatorGroup, props } from '@ngrx/signals/events';
 *
 * const counterPageEvents = eventCreatorGroup({
 *   source: 'Counter Page',
 *   events: {
 *     increment: emptyProps(),
 *     decrement: emptyProps(),
 *     set: props<{ count: number }>(),
 *   },
 * });
 * ```
 */
export function eventCreatorGroup<
  Source extends string,
  Events extends Record<string, object | undefined>
>(config: {
  source: Source;
  events: Events;
}): Prettify<EventCreatorGroup<Source, Events>> {
  return Object.entries(config.events).reduce((acc, [eventName, props]) => {
    const eventType = `[${config.source}] ${eventName}`;
    return {
      ...acc,
      [eventName]: props
        ? eventCreator(eventType, props)
        : eventCreator(eventType),
    };
  }, {} as EventCreatorGroup<Source, Events>);
}
