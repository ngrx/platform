import { Injectable } from '@angular/core';
import {
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
} from 'rxjs';
import { EventInstance } from './event-instance';
import { EventCreator } from './event-creator';

export const EVENTS = Symbol();
export const SOURCE_TYPE = Symbol();

abstract class BaseEvents {
  /**
   * @internal
   */
  readonly [EVENTS] = new Subject<EventInstance<string, unknown>>();

  on(): Observable<EventInstance<string, unknown>>;
  on<EventCreators extends EventCreator<string, any>[]>(
    ...events: [...EventCreators]
  ): Observable<
    { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number]
  >;
  on(
    ...events: EventCreator<string, unknown>[]
  ): Observable<EventInstance<string, unknown>> {
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
 * import { event, Events } from '@ngrx/signals/events';
 *
 * const increment = event('[Counter Page] Increment');
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

function filterByType<T extends EventInstance<string, unknown>>(
  events: EventCreator<string, unknown>[]
): MonoTypeOperatorFunction<T> {
  if (events.length === 0) {
    return (source$) => source$;
  }

  const eventMap = toEventCreatorMap(events);
  return filter<T>(({ type }) => !!eventMap[type]);
}

function toEventCreatorMap(
  events: EventCreator<string, unknown>[]
): Record<string, EventCreator<string, unknown>> {
  return events.reduce((acc, event) => ({ ...acc, [event.type]: event }), {});
}

function withSourceType<
  T extends EventInstance<string, unknown>,
>(): MonoTypeOperatorFunction<T> {
  return map(({ ...event }) => {
    Object.defineProperty(event, SOURCE_TYPE, { value: event.type });
    return event;
  });
}
