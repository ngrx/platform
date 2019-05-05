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
import { NotificationKind } from 'rxjs/internal/Notification';

/** Represents config with named paratemeters for mapToAction */
export interface MapToActionConfig<
  InputAction extends Action,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action,
  UnsubscribeAction extends Action
> {
  // Project function that produces the output actions in success cases
  project: (action: InputAction, index: number) => Observable<OutputAction>;
  // Error handle function for project
  error: (error: any, action: InputAction) => ErrorAction;
  // Optional complete action provider
  // count is the number of actions project emitted before completion
  // action is the action that was completed
  complete?: (count: number, action: InputAction) => CompleteAction;
  // Optional flattening operator
  operator?: <InputAction, OutputAction>(
    project: (input: InputAction, index: number) => Observable<OutputAction>
  ) => OperatorFunction<InputAction, OutputAction>;
  // Optional unsubscribe action provider
  // count is the number of actions project emitted before unsubscribing
  // action is the action that was unsubscribed from
  unsubscribe?: (count: number, action: InputAction) => UnsubscribeAction;
}

/**
 * Wraps project fn with error handling making it safe to use in Effects.
 * Takes either config with named properties that represent different possible
 * callbacks or project/error callbacks that are required.
 */
export function mapToAction<
  InputAction extends Action,
  OutputAction extends Action,
  ErrorAction extends Action
>(
  project: (action: InputAction, index: number) => Observable<OutputAction>,
  error: (error: any, action: InputAction) => ErrorAction
): (source: Observable<InputAction>) => Observable<OutputAction | ErrorAction>;
export function mapToAction<
  InputAction extends Action,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  config: MapToActionConfig<
    InputAction,
    OutputAction,
    ErrorAction,
    CompleteAction,
    UnsubscribeAction
  >
): (
  source: Observable<InputAction>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
>;
export function mapToAction<
  InputAction extends Action,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  /** Allow to take either config object or project/error functions */
  configOrProject:
    | MapToActionConfig<
        InputAction,
        OutputAction,
        ErrorAction,
        CompleteAction,
        UnsubscribeAction
      >
    | ((action: InputAction, index: number) => Observable<OutputAction>),
  errorFn?: (error: any, action: InputAction) => ErrorAction
): (
  source: Observable<InputAction>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
> {
  const { project, error, complete, operator, unsubscribe } =
    typeof configOrProject === 'function'
      ? {
          project: configOrProject,
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
  return source =>
    defer(
      (): Observable<ResultAction> => {
        const subject = new Subject<UnsubscribeAction>();
        return merge(
          source.pipe(
            operator((action, index) =>
              defer(() => {
                let completed = false;
                let errored = false;
                let projectedCount = 0;
                return project(action, index).pipe(
                  materialize(),
                  map(
                    (notification): Notification<ResultAction> | undefined => {
                      switch (notification.kind) {
                        case NotificationKind.ERROR:
                          errored = true;
                          return new Notification(
                            NotificationKind.NEXT,
                            error(notification.error, action)
                          );
                        case NotificationKind.COMPLETE:
                          completed = true;
                          return complete
                            ? new Notification(
                                NotificationKind.NEXT,
                                complete(projectedCount, action)
                              )
                            : undefined;
                        default:
                          ++projectedCount;
                          return notification;
                      }
                    }
                  ),
                  filter((n): n is NonNullable<typeof n> => n != null),
                  dematerialize(),
                  finalize(() => {
                    if (!completed && !errored && unsubscribe) {
                      subject.next(unsubscribe(projectedCount, action));
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
