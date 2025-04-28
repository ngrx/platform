import {
  assertInInjectionContext,
  inject,
  Injector,
  untracked,
} from '@angular/core';
import { Prettify } from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { EventCreator, EventCreatorWithProps } from './event-creator';

type InjectDispatchResult<
  EventGroup extends Record<string, EventCreator | EventCreatorWithProps>
> = {
  [EventName in keyof EventGroup]: Parameters<EventGroup[EventName]> extends [
    infer Props
  ]
    ? (props: Props) => void
    : () => void;
};

/**
 * @experimental
 * @description
 *
 * Creates self-dispatching events for a given event group.
 *
 * @usageNotes
 *
 * ```ts
 * import { eventGroup, injectDispatch } from '@ngrx/signals/events';
 *
 * const counterPageEvents = eventGroup({
 *   source: 'Counter Page',
 *   events: {
 *     increment: emptyProps(),
 *     decrement: emptyProps(),
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
  EventGroup extends Record<string, EventCreator | EventCreatorWithProps>
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
      [eventName]: (props?: object) =>
        untracked(() => dispatcher.dispatch(eventCreator(props))),
    }),
    {} as InjectDispatchResult<EventGroup>
  );
}
