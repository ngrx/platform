import { Injectable } from '@angular/core';
import {
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
} from 'rxjs';
import { Event } from './event';
import { EventCreator, EventCreatorWithProps } from './event-creator';

export const EVENTS = Symbol();
export const SOURCE_TYPE = Symbol();

abstract class BaseEvents {
  /**
   * @internal
   */
  readonly [EVENTS] = new Subject<Event>();

  on(): Observable<Event>;
  on<EventCreators extends Array<EventCreator | EventCreatorWithProps>>(
    ...events: [...EventCreators]
  ): Observable<
    { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number]
  >;
  on(
    ...events: Array<EventCreator | EventCreatorWithProps>
  ): Observable<Event> {
    return this[EVENTS].pipe(filterByType(events), withSourceType());
  }
}

/**
 * @experimental
 * @description
 *
 * Globally provided service for listening to dispatched events.
 *
 * @usageNotes
 *
 * ```ts
 * import { eventCreator, Events } from '@ngrx/signals/events';
 *
 * const increment = eventCreator('[Counter Page] Increment');
 *
 * \@Component({ \/* ... *\/ })
 * class Counter {
 *   readonly #events = inject(Events);
 *
 *   constructor() {
 *     this.#events
 *       .on(increment)
 *       .pipe(takeUntilDestroyed())
 *       .subscribe(() => \/* handle increment event *\/);
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class Events extends BaseEvents {}

@Injectable({ providedIn: 'root' })
export class ReducerEvents extends BaseEvents {}

function filterByType<T extends Event>(
  events: Array<EventCreator | EventCreatorWithProps>
): MonoTypeOperatorFunction<T> {
  if (events.length === 0) {
    return (source$) => source$;
  }

  const eventMap = toEventCreatorMap(events);
  return filter<T>(({ type }) => !!eventMap[type]);
}

function toEventCreatorMap(
  events: Array<EventCreator | EventCreatorWithProps>
): Record<string, EventCreator | EventCreatorWithProps> {
  return events.reduce((acc, event) => ({ ...acc, [event.type]: event }), {});
}

function withSourceType<T extends Event>(): MonoTypeOperatorFunction<T> {
  return map(({ ...event }) => {
    Object.defineProperty(event, SOURCE_TYPE, { value: event.type });
    return event;
  });
}
