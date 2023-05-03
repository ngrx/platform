import {
  ActionCreator,
  ActionCreatorProps,
  Creator,
  FunctionWithParametersType,
  NotAllowedCheck,
  TypedAction,
} from './models';

// Generating API docs for the `createActionGroup` function is solved by moving its types
// to a separate file. These types should be moved to the `action_group_creator.ts` file
// when `dgeni` resolves the bug with template literal types.

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
    ? ActionCreator<Type, () => TypedAction<Type>>
    : ActionCreator<
        Type,
        (
          props: Props & NotAllowedCheck<Props & object>
        ) => Props & TypedAction<Type>
      >
  : PropsCreator extends Creator<infer Props, infer Result>
  ? FunctionWithParametersType<
      Props,
      Result & NotAllowedCheck<Result> & TypedAction<Type>
    > &
      TypedAction<Type>
  : never;

export type ActionName<EventName extends string> = Uncapitalize<
  Join<CapitalizeWords<EventName>>
>;

export interface ActionGroupConfig<
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

export type ActionGroup<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>
> = {
  [EventName in keyof Events as ActionName<EventName & string>]: EventCreator<
    Events[EventName],
    `[${Source}] ${EventName & string}`
  >;
};
