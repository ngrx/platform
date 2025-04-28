import { inject, Injectable } from '@angular/core';
import { Event } from './event';
import { Events, EVENTS, ReducerEvents } from './events';
import { isEventCreator } from './event-creator';

declare const ngDevMode: unknown;

/**
 * @experimental
 * @description
 *
 * Globally provided service for dispatching events.
 *
 * @usageNotes
 *
 * ```ts
 * import { Dispatcher, eventCreator } from '@ngrx/signals/events';
 *
 * const increment = eventCreator('[Counter Page] Increment');
 *
 * \@Component({ \/* ... *\/ })
 * class Counter {
 *   readonly #dispatcher = inject(Dispatcher);
 *
 *   increment(): void {
 *     this.#dispatcher.dispatch(increment());
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class Dispatcher {
  protected readonly reducerEvents = inject(ReducerEvents);
  protected readonly events = inject(Events);

  dispatch(event: Event): void {
    if (
      typeof ngDevMode !== 'undefined' &&
      ngDevMode &&
      isEventCreator(event)
    ) {
      console.warn(
        '@ngrx/signals/events: Event creator should not be dispatched.',
        'Did you forget to call it?'
      );
    }

    this.reducerEvents[EVENTS].next(event);
    this.events[EVENTS].next(event);
  }
}
