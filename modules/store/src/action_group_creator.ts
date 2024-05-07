import { createAction, props } from './action_creator';
import {
  ActionCreator,
  ActionCreatorProps,
  Creator,
  FunctionWithParametersType,
  NotAllowedCheck,
  Action,
} from './models';
import { capitalize, uncapitalize } from './helpers';

type Join<
  Str extends string,
  Separator extends string = ' '
> = Str extends `${infer First}${Separator}${infer Rest}`
  ? Join<`${First}${Rest}`, Separator>
  : Str;

type CapitalizeWords<Str extends string> =
  Str extends `${infer First} ${infer Rest}`
    ? `${Capitalize<First>} ${CapitalizeWords<Rest>}`
    : Capitalize<Str>;

type StringLiteralCheck<
  Str extends string,
  Name extends string
> = string extends Str ? `${Name} must be a string literal type` : unknown;

type UniqueEventNameCheck<
  EventNames extends string,
  EventName extends string
> = ActionName<EventName> extends ActionName<Exclude<EventNames, EventName>>
  ? `${ActionName<EventName>} action is already defined`
  : unknown;

type NotAllowedEventPropsCheck<
  PropsCreator extends ActionCreatorProps<unknown> | Creator
> = PropsCreator extends ActionCreatorProps<infer Props>
  ? Props extends void
    ? unknown
    : NotAllowedCheck<Props & object>
  : PropsCreator extends Creator<any, infer Result>
  ? NotAllowedCheck<Result>
  : unknown;

type EventCreator<
  PropsCreator extends ActionCreatorProps<unknown> | Creator,
  Type extends string
> = PropsCreator extends ActionCreatorProps<infer Props>
  ? void extends Props
    ? ActionCreator<Type, () => Action<Type>>
    : ActionCreator<
        Type,
        (props: Props & NotAllowedCheck<Props & object>) => Props & Action<Type>
      >
  : PropsCreator extends Creator<infer Props, infer Result>
  ? FunctionWithParametersType<
      Props,
      Result & NotAllowedCheck<Result> & Action<Type>
    > &
      Action<Type>
  : never;

type ActionName<EventName extends string> = Uncapitalize<
  Join<CapitalizeWords<EventName>>
>;

interface ActionGroupConfig<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>
> {
  source: Source & StringLiteralCheck<Source, 'source'>;
  events: Events & {
    [EventName in keyof Events]: StringLiteralCheck<
      EventName & string,
      'event name'
    > &
      UniqueEventNameCheck<keyof Events & string, EventName & string> &
      NotAllowedEventPropsCheck<Events[EventName]>;
  };
}

type ActionGroup<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>
> = {
  [EventName in keyof Events as ActionName<EventName & string>]: EventCreator<
    Events[EventName],
    `[${Source}] ${EventName & string}`
  >;
};

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
        (events as any)[eventName]
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
    .split(' ')
    .map((word, i) => (i === 0 ? uncapitalize(word) : capitalize(word)))
    .join('') as ActionName<EventName>;
}

function toActionType<Source extends string, EventName extends string>(
  source: Source,
  eventName: EventName
): `[${Source}] ${EventName}` {
  return `[${source}] ${eventName}`;
}
