import { Action } from '@ngrx/store';
import {
  defer,
  merge,
  Notification,
  Observable,
  OperatorFunction,
  Subject,
} from 'rxjs';
import {
  concatMap,
  dematerialize,
  filter,
  finalize,
  map,
  materialize,
} from 'rxjs/operators';

/** Represents config with named parameters for act */
export interface ActConfig<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action,
  UnsubscribeAction extends Action
> {
  // Project function that produces the output actions in success cases
  project: (input: Input, index: number) => Observable<OutputAction>;
  // Error handle function for project
  // error that happened during project execution
  // input value that project errored with
  error: (error: any, input: Input) => ErrorAction;
  // Optional complete action provider
  // count is the number of actions project emitted before completion
  // input value that project completed with
  complete?: (count: number, input: Input) => CompleteAction;
  // Optional flattening operator
  operator?: <Input, OutputAction>(
    project: (input: Input, index: number) => Observable<OutputAction>
  ) => OperatorFunction<Input, OutputAction>;
  // Optional unsubscribe action provider
  // count is the number of actions project emitted before unsubscribing
  // input value that was unsubscribed from
  unsubscribe?: (count: number, input: Input) => UnsubscribeAction;
}

/**
 * Wraps project fn with error handling making it safe to use in Effects.
 * Takes either config with named properties that represent different possible
 * callbacks or project/error callbacks that are required.
 */
export function act<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action
>(
  project: (input: Input, index: number) => Observable<OutputAction>,
  error: (error: any, input: Input) => ErrorAction
): (source: Observable<Input>) => Observable<OutputAction | ErrorAction>;
export function act<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  config: ActConfig<
    Input,
    OutputAction,
    ErrorAction,
    CompleteAction,
    UnsubscribeAction
  >
): (
  source: Observable<Input>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
>;
export function act<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  /** Allow to take either config object or project/error functions */
  configOrProject:
    | ActConfig<
        Input,
        OutputAction,
        ErrorAction,
        CompleteAction,
        UnsubscribeAction
      >
    | ((input: Input, index: number) => Observable<OutputAction>),
  errorFn?: (error: any, input: Input) => ErrorAction
): (
  source: Observable<Input>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
> {
  const { project, error, complete, operator, unsubscribe } =
    typeof configOrProject === 'function'
      ? {
          project: configOrProject,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          error: errorFn!,
          operator: concatMap,
          complete: undefined,
          unsubscribe: undefined,
        }
      : { ...configOrProject, operator: configOrProject.operator || concatMap };

  type ResultAction =
    | OutputAction
    | ErrorAction
    | CompleteAction
    | UnsubscribeAction;
  return (source) =>
    defer(
      (): Observable<ResultAction> => {
        const subject = new Subject<UnsubscribeAction>();
        return merge(
          source.pipe(
            operator((input, index) =>
              defer(() => {
                let completed = false;
                let errored = false;
                let projectedCount = 0;
                return project(input, index).pipe(
                  materialize(),
                  map((notification):
                    | (Notification<
                        ErrorAction | CompleteAction | OutputAction
                      > & {
                        kind: 'N';
                        value: ErrorAction | CompleteAction | OutputAction;
                      })
                    | undefined => {
                    switch (notification.kind) {
                      case 'E':
                        errored = true;
                        return new Notification(
                          'N',
                          error(notification.error, input)
                        ) as Notification<ErrorAction> & {
                          kind: 'N';
                          value: ErrorAction;
                        };
                      case 'C':
                        completed = true;
                        return complete
                          ? (new Notification(
                              'N',
                              complete(projectedCount, input)
                            ) as Notification<CompleteAction> & {
                              kind: 'N';
                              value: CompleteAction;
                            })
                          : undefined;
                      default:
                        ++projectedCount;
                        return notification as Notification<OutputAction> & {
                          kind: 'N';
                          value: OutputAction;
                        };
                    }
                  }),
                  filter((n): n is NonNullable<typeof n> => n != null),
                  dematerialize(),
                  finalize(() => {
                    if (!completed && !errored && unsubscribe) {
                      subject.next(unsubscribe(projectedCount, input));
                    }
                  })
                );
              })
            )
          ),
          subject
        );
      }
    );
}
