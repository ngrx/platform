import { PartialStateUpdater } from '@ngrx/signals';
import { EventCreator } from './event-creator';

export type CaseReducerResult<
  State extends object,
  EventCreators extends EventCreator<string, any>[]
> = {
  reducer: CaseReducer<State, EventCreators>;
  events: EventCreators;
};

type CaseReducer<
  State extends object,
  EventCreators extends EventCreator<string, any>[]
> = (
  event: { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number],
  state: State
) =>
  | Partial<State>
  | PartialStateUpdater<State>
  | Array<Partial<State> | PartialStateUpdater<State>>;

/**
 * @experimental
 * @description
 *
 * Creates a case reducer that can be used with the `withReducer` feature.
 */
export function on<
  State extends object,
  EventCreators extends EventCreator<string, any>[]
>(
  ...args: [
    ...events: [...EventCreators],
    reducer: CaseReducer<NoInfer<State>, NoInfer<EventCreators>>
  ]
): CaseReducerResult<State, EventCreators> {
  const reducer = args.pop() as CaseReducer<State, EventCreators>;
  const events = args as unknown as EventCreators;

  return { reducer, events };
}
