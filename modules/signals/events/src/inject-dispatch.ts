import {
  assertInInjectionContext,
  inject,
  Injector,
  untracked,
} from '@angular/core';
import { Prettify } from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { EventCreator } from './event-creator';

type InjectDispatchResult<
  EventGroup extends Record<string, EventCreator<string, any>>
> = {
  [EventName in keyof EventGroup]: Parameters<EventGroup[EventName]> extends [
    infer Payload
  ]
    ? (payload: Payload) => void
    : () => void;
};

/**
 * @experimental
 * Creates self-dispatching events for a given event group.
 *
 * @example
 *
 * ```ts
 * import { type } from '@ngrx/signals';
 * import { eventGroup, injectDispatch } from '@ngrx/signals/events';
 *
 * const counterPageEvents = eventGroup({
 *   source: 'Counter Page',
 *   events: {
 *     increment: type<void>(),
 *     decrement: type<void>(),
 *   },
 * });
 *
 * \@Component({ \/* ... *\/ })
 * class Counter {
 *   readonly dispatch = injectDispatch(counterPageEvents);
 *
 *   increment(): void {
 *     this.dispatch.increment();
 *   }
 *
 *   decrement(): void {
 *     this.dispatch.decrement();
 *   }
 * }
 * ```
 */
export function injectDispatch<
  EventGroup extends Record<string, EventCreator<string, any>>
>(
  events: EventGroup,
  config?: { injector?: Injector }
): Prettify<InjectDispatchResult<EventGroup>> {
  if (!config?.injector) {
    assertInInjectionContext(injectDispatch);
  }

  const injector = config?.injector ?? inject(Injector);
  const dispatcher = injector.get(Dispatcher);

  return Object.entries(events).reduce(
    (acc, [eventName, eventCreator]) => ({
      ...acc,
      [eventName]: (payload?: unknown) =>
        untracked(() => dispatcher.dispatch(eventCreator(payload))),
    }),
    {} as InjectDispatchResult<EventGroup>
  );
}
