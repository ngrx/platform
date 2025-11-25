import { EventInstance } from './event-instance';

export type EventCreator<Type extends string, Payload> = ((
  payload: Payload
) => EventInstance<Type, Payload>) & { type: Type };

export function event<Type extends string>(
  type: Type
): EventCreator<Type, void>;
export function event<Type extends string, Payload>(
  type: Type,
  payload: Payload
): EventCreator<Type, Payload>;
/**
 * @description
 *
 * Creates an event creator.
 *
 * @usageNotes
 *
 * ### Creating an event creator without payload
 *
 * ```ts
 * import { event } from '@ngrx/signals/events';
 *
 * const increment = event('[Counter Page] Increment');
 * ```
 *
 * ### Creating an event creator with payload
 *
 * ```ts
 * import { type } from '@ngrx/signals';
 * import { event } from '@ngrx/signals/events';
 *
 * const set = event('[Counter Page] Set', type<number>());
 * ```
 */
export function event(type: string): EventCreator<string, any> {
  const creator = (payload?: unknown) => ({ type, payload });
  (creator as any).type = type;

  return creator as EventCreator<string, unknown>;
}
