import { Event, EventWithProps } from './event';

declare const ngDevMode: unknown;

/**
 * @experimental
 */
export type EventCreator<Type extends string = string> = (() => Event<Type>) &
  Event<Type>;

/**
 * @experimental
 */
export type EventCreatorWithProps<
  Type extends string = string,
  Props extends object = any
> = ((props: Props) => EventWithProps<Type, Props>) & Event<Type>;

export function eventCreator<Type extends string>(
  type: Type
): EventCreator<Type>;
export function eventCreator<Type extends string, Props extends object>(
  type: Type,
  props: Props
): EventCreatorWithProps<Type, Props>;
/**
 * @experimental
 * @description
 *
 * Creates an event creator.
 *
 * @usageNotes
 *
 * ### Creating an event creator without props
 *
 * ```ts
 * import { eventCreator } from '@ngrx/signals/events';
 *
 * const increment = eventCreator('[Counter Page] Increment');
 * ```
 *
 * ### Creating an event creator with props
 *
 * ```ts
 * import { eventCreator, props } from '@ngrx/signals/events';
 *
 * const set = eventCreator('[Counter Page] Set', props<{ count: number }>());
 * ```
 */
export function eventCreator(
  type: string
): EventCreator | EventCreatorWithProps {
  const creator = (props?: object) => {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      if (Array.isArray(props)) {
        console.warn('@ngrx/signals/events: Event props cannot be an array.');
      }

      if (props && typeof props === 'object' && 'type' in props) {
        console.warn(
          '@ngrx/signals/events: Event props cannot contain a type property.'
        );
      }
    }

    return { type, ...props };
  };
  (creator as any).type = type;

  return creator as EventCreator | EventCreatorWithProps;
}

export function isEventCreator(value: unknown): value is EventCreator {
  return typeof value === 'function' && 'type' in value;
}
