import { Prettify } from '@ngrx/signals';
import { event, EventCreator } from './event-creator';

type EventType<
  Source extends string,
  EventName extends string,
> = `[${Source}] ${EventName}`;

type EventCreatorGroup<
  Source extends string,
  Events extends Record<string, any>,
> = {
  readonly [EventName in keyof Events]: EventName extends string
    ? EventCreator<EventType<Source, EventName>, Events[EventName]>
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
 * import { type } from '@ngrx/signals';
 * import { eventGroup } from '@ngrx/signals/events';
 *
 * const counterPageEvents = eventGroup({
 *   source: 'Counter Page',
 *   events: {
 *     increment: type<void>(),
 *     decrement: type<void>(),
 *     set: type<number>(),
 *   },
 * });
 * ```
 */
export function eventGroup<
  Source extends string,
  Events extends Record<string, unknown>,
>(config: {
  source: Source;
  events: Events;
}): Prettify<EventCreatorGroup<Source, Events>> {
  return Object.entries(config.events).reduce(
    (acc, [eventName]) => {
      const eventType = `[${config.source}] ${eventName}`;
      return { ...acc, [eventName]: event(eventType) };
    },
    {} as EventCreatorGroup<Source, Events>
  );
}
