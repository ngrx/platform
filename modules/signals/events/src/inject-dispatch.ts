import {
  assertInInjectionContext,
  inject,
  Injector,
  untracked,
} from '@angular/core';
import { Prettify } from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { EventCreator } from './event-creator';
import { EventScope, EventScopeConfig } from './event-scope';

type SelfDispatchingEvents<
  EventGroup extends Record<string, EventCreator<string, any>>,
> = {
  readonly [EventName in keyof EventGroup]: Parameters<
    EventGroup[EventName]
  > extends [infer Payload]
    ? (payload: Payload) => void
    : () => void;
};

/**
 * @description
 *
 * Creates self-dispatching events for a given event group.
 *
 * @usageNotes
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
 * \@Component({ /* ... *\/ })
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
  EventGroup extends Record<string, EventCreator<string, any>>,
>(
  events: EventGroup,
  config?: { injector?: Injector }
): ((config: EventScopeConfig) => Prettify<SelfDispatchingEvents<EventGroup>>) &
  Prettify<SelfDispatchingEvents<EventGroup>> {
  if (typeof ngDevMode !== 'undefined' && ngDevMode && !config?.injector) {
    assertInInjectionContext(injectDispatch);
  }

  const injector = config?.injector ?? inject(Injector);
  const dispatcher = injector.get(Dispatcher);

  const eventsCache = {} as Record<
    EventScope,
    SelfDispatchingEvents<EventGroup>
  >;

  const dispatch = (config: EventScopeConfig) => {
    if (!eventsCache[config.scope]) {
      eventsCache[config.scope] = Object.entries(events).reduce(
        (acc, [eventName, eventCreator]) => ({
          ...acc,
          [eventName]: (payload?: unknown) =>
            untracked(() => dispatcher.dispatch(eventCreator(payload), config)),
        }),
        {} as SelfDispatchingEvents<EventGroup>
      );
    }

    return eventsCache[config.scope];
  };

  const defaultEventGroup = dispatch({ scope: 'self' });
  const defaultEventGroupProps = Object.keys(defaultEventGroup).reduce(
    (acc, eventName) => ({
      ...acc,
      [eventName]: {
        value: defaultEventGroup[eventName],
        enumerable: true,
      },
    }),
    {} as PropertyDescriptorMap
  );
  Object.defineProperties(dispatch, defaultEventGroupProps);

  return dispatch as ReturnType<typeof injectDispatch<EventGroup>>;
}
