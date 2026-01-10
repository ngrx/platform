import { inject, Injectable, Type } from '@angular/core';
import {
  filter,
  map,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
} from 'rxjs';
import { EventInstance } from './event-instance';
import { EventCreator } from './event-creator';

export const EVENTS = Symbol(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'EVENTS' : ''
);
export const SOURCE_TYPE = Symbol(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'SOURCE_TYPE' : ''
);

abstract class BaseEvents {
  /**
   * @internal
   */
  readonly [EVENTS] = new Subject<EventInstance<string, unknown>>();
  protected readonly events$: Observable<EventInstance<string, unknown>>;

  protected constructor(parentEventsToken: Type<BaseEvents>) {
    const parentEvents = inject(parentEventsToken, {
      skipSelf: true,
      optional: true,
    });
    this.events$ = parentEvents
      ? merge(parentEvents.events$, this[EVENTS])
      : this[EVENTS].asObservable();
  }

  on(): Observable<EventInstance<string, unknown>>;
  on<EventCreators extends EventCreator<string, any>[]>(
    ...events: [...EventCreators]
  ): Observable<
    { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number]
  >;
  on(
    ...events: EventCreator<string, unknown>[]
  ): Observable<EventInstance<string, unknown>> {
    return this.events$.pipe(filterByType(events), withSourceType());
  }
}

/**
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
 * \@Component(...)
 * class Counter {
 *   readonly #events = inject(Events);
 *
 *   constructor() {
 *     this.#events
 *       .on(increment)
 *       .pipe(takeUntilDestroyed())
 *       .subscribe(() => /* handle increment event *\/);
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'platform' })
export class Events extends BaseEvents {
  constructor() {
    super(Events);
  }
}

/**
 * @description
 *
 * Globally provided service for listening to dispatched events.
 * Receives events before the `Events` service and is primarily used for
 * handling state transitions.
 */
@Injectable({ providedIn: 'platform' })
export class ReducerEvents extends BaseEvents {
  constructor() {
    super(ReducerEvents);
  }
}

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
