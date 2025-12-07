import { inject, Injectable, Provider } from '@angular/core';
import { queueScheduler } from 'rxjs';
import { EventInstance } from './event-instance';
import { EventScope, EventScopeConfig } from './event-scope';
import { Events, EVENTS, ReducerEvents } from './events-service';

/**
 * @description
 *
 * Globally provided service for dispatching events.
 *
 * @usageNotes
 *
 * ```ts
 * import { Dispatcher, event } from '@ngrx/signals/events';
 *
 * const increment = event('[Counter Page] Increment');
 *
 * \@Component({ /* ... *\/ })
 * class Counter {
 *   readonly #dispatcher = inject(Dispatcher);
 *
 *   increment(): void {
 *     this.#dispatcher.dispatch(increment());
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'platform' })
export class Dispatcher {
  protected readonly reducerEvents = inject(ReducerEvents);
  protected readonly events = inject(Events);
  protected readonly parentDispatcher = inject(Dispatcher, {
    skipSelf: true,
    optional: true,
  });

  dispatch(
    event: EventInstance<string, unknown>,
    config?: EventScopeConfig
  ): void {
    if (this.parentDispatcher && hasParentOrGlobalScope(config)) {
      this.parentDispatcher.dispatch(
        event,
        config.scope === 'global' ? config : undefined
      );
    } else {
      this.reducerEvents[EVENTS].next(event);
      queueScheduler.schedule(() => this.events[EVENTS].next(event));
    }
  }
}

/**
 * @description
 *
 * Provides scoped instances of Dispatcher and Events services.
 * Enables event dispatching within a specific component or feature scope.
 *
 * @usageNotes
 *
 * ```ts
 * import { Dispatcher, event } from '@ngrx/signals/events';
 *
 * const increment = event('[Counter Page] Increment');
 *
 * \@Component({
 *   /* ... *\/
 *   providers: [provideDispatcher()],
 * })
 * class Counter {
 *   readonly #dispatcher = inject(Dispatcher);
 *
 *   increment(): void {
 *     // Dispatching an event to the local Dispatcher.
 *     this.#dispatcher.dispatch(increment());
 *
 *     // Dispatching an event to the parent Dispatcher.
 *     this.#dispatcher.dispatch(increment(), { scope: 'parent' });
 *
 *     // Dispatching an event to the global Dispatcher.
 *     this.#dispatcher.dispatch(increment(), { scope: 'global' });
 *   }
 * }
 * ```
 */
export function provideDispatcher(): Provider[] {
  return [Events, ReducerEvents, Dispatcher];
}

function hasParentOrGlobalScope(
  config?: EventScopeConfig
): config is { scope: Exclude<EventScope, 'self'> } {
  return config?.scope === 'parent' || config?.scope === 'global';
}
