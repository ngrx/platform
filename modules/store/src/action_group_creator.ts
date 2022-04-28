import { createAction, props } from './action_creator';
import { ActionCreatorProps, Creator } from './models';
import { capitalize } from './helpers';
import {
  ActionGroup,
  ActionGroupConfig,
  ActionName,
} from './action_group_creator_models';

/**
 * @description
 * A function that creates a group of action creators with the same source.
 *
 * @param config An object that contains a source and dictionary of events.
 * An event is a key-value pair of an event name and event props.
 * @returns A dictionary of action creators.
 * The name of each action creator is created by camel casing the event name.
 * The type of each action is created using the "[Source] Event Name" pattern.
 *
 * @usageNotes
 *
 * ```ts
 * const authApiActions = createActionGroup({
 *   source: 'Auth API',
 *   events: {
 *     // defining events with payload using the `props` function
 *     'Login Success': props<{ userId: number; token: string }>(),
 *     'Login Failure': props<{ error: string }>(),
 *
 *     // defining an event without payload using the `emptyProps` function
 *     'Logout Success': emptyProps(),
 *
 *     // defining an event with payload using the props factory
 *     'Logout Failure': (error: Error) => ({ error }),
 *   },
 * });
 *
 * // action type: "[Auth API] Login Success"
 * authApiActions.loginSuccess({ userId: 10, token: 'ngrx' });
 *
 * // action type: "[Auth API] Login Failure"
 * authApiActions.loginFailure({ error: 'Login Failure!' });
 *
 * // action type: "[Auth API] Logout Success"
 * authApiActions.logoutSuccess();
 *
 * // action type: "[Auth API] Logout Failure";
 * authApiActions.logoutFailure(new Error('Logout Failure!'));
 * ```
 */
export function createActionGroup<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>
>(config: ActionGroupConfig<Source, Events>): ActionGroup<Source, Events> {
  const { source, events } = config;

  return Object.keys(events).reduce(
    (actionGroup, eventName) => ({
      ...actionGroup,
      [toActionName(eventName)]: createAction(
        toActionType(source, eventName),
        events[eventName]
      ),
    }),
    {} as ActionGroup<Source, Events>
  );
}

export function emptyProps(): ActionCreatorProps<void> {
  return props();
}

function toActionName<EventName extends string>(
  eventName: EventName
): ActionName<EventName> {
  return eventName
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word, i) => (i === 0 ? word : capitalize(word)))
    .join('') as ActionName<EventName>;
}

function toActionType<Source extends string, EventName extends string>(
  source: Source,
  eventName: EventName
): `[${Source}] ${EventName}` {
  return `[${source}] ${eventName}`;
}
