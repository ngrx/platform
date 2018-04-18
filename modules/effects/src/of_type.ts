import { Action } from '@ngrx/store';
import {
  Observable,
  Operator,
  OperatorFunction,
  Subscriber,
  TeardownLogic,
  Subject,
  Subscription,
} from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { merge } from 'rxjs';

let supportsMapAndSet = false;

forceBasicMode(false);

function ofTypeBasic<T extends Action>(
  ...allowedTypes: string[]
): OperatorFunction<Action, T> {
  return filter((action: Action): action is T =>
    allowedTypes.some(type => type === action.type)
  );
}

/**
 * The Action to Stream Map, is a map of observables
 *
 * Explained in a marble diagram:
 *
 * Map<Sources to Filters>
 * sourceA -> {
 *            A: Subject<A Action>,
 *            B: Subject<B Action>
 *            }
 *
 * B into sourceA, emits, a value on the B Subject.
 */
let __actionToStreamMap: Map<Observable<Action>, Map<string, Subject<any>>>;
let __actionToStreamSubscriptionsCount: Map<
  Observable<Action>,
  Map<string, number>
>;
let __sourceSubscriptionsCount: Map<Observable<Action>, number>;
let __sourceSubscriptions: Map<Observable<Action>, Subscription>;

if (supportsMapAndSet) {
  __actionToStreamMap = new Map();
  __actionToStreamSubscriptionsCount = new Map();
  __sourceSubscriptionsCount = new Map();
  __sourceSubscriptions = new Map();
}

function trackSourceSubscriptions(source: Observable<Action>) {
  const count = (__sourceSubscriptionsCount.get(source) || 0) + 1;
  __sourceSubscriptionsCount.set(source, count);
}

function untrackSourceSubscriptions(source: Observable<Action>) {
  let count = (__sourceSubscriptionsCount.get(source) || 0) - 1;
  __sourceSubscriptionsCount.set(source, count <= 0 ? 0 : count);
  return count;
}

function subscribeToSource(source: Observable<Action>) {
  if (!__sourceSubscriptions.has(source)) {
    __sourceSubscriptionsCount.set(source, 0);
    __sourceSubscriptions.set(
      source,
      source.subscribe(
        next => {
          const type = next ? next.type : null;
          if (type !== null) {
            const allActions = __actionToStreamMap.get(source);
            if (allActions) {
              const actionSubject = allActions.get(type);
              if (actionSubject) {
                actionSubject.next(next);
              }
            }
          }
        },
        err => {
          // Propogate the error and reset.
          const allActions = __actionToStreamMap.get(source);
          if (allActions) {
            allActions.forEach(action => {
              action.error(err);
            });
          }
          __actionToStreamMap.set(source, new Map());
        },
        () => {
          // Propogate the completion and reset.
          const allActions = __actionToStreamMap.get(source);
          if (allActions) {
            allActions.forEach(action => {
              action.complete();
            });
          }
          __actionToStreamMap.set(source, new Map());
        }
      )
    );
  }
  trackSourceSubscriptions(source);
}

function unsubscribeFromSource(source: Observable<Action>) {
  const count = untrackSourceSubscriptions(source);
  if (count === 0) {
    const subscription = __sourceSubscriptions.get(source);
    if (subscription) {
      subscription.unsubscribe();
      __sourceSubscriptions.delete(source);
    }
  }
}

function listenToActions<T extends Action>(
  source: Observable<Action>,
  actionTypes: string[]
) {
  let sourceToActionsMap: Map<string, Subject<Action>> =
    __actionToStreamMap.get(source) || new Map();
  if (!__actionToStreamMap.has(source)) {
    __actionToStreamMap.set(source, sourceToActionsMap);
  }
  let actionSubscriptionsCount: Map<string, number> =
    __actionToStreamSubscriptionsCount.get(source) || new Map();
  if (!__actionToStreamSubscriptionsCount.has(source)) {
    __actionToStreamSubscriptionsCount.set(source, actionSubscriptionsCount);
  }
  function listenToAction(actionType: string) {
    if (!sourceToActionsMap.has(actionType)) {
      sourceToActionsMap.set(actionType, new Subject<Action>());
    }
    actionSubscriptionsCount.set(
      actionType,
      (actionSubscriptionsCount.get(actionType) || 0) + 1
    );
  }
  actionTypes.forEach(listenToAction);
}
function unlistenToActions<T extends Action>(
  source: Observable<Action>,
  actionTypes: string[]
) {
  let actionSubscriptionsCount: Map<
    string,
    number
  > = __actionToStreamSubscriptionsCount.get(source) as any; // Will always exist.
  function unlistenToAction(actionType: string) {
    let count = (actionSubscriptionsCount.get(actionType) || 0) - 1;
    actionSubscriptionsCount.set(actionType, count < 0 ? 0 : count);
    if (count <= 0) {
      const map = __actionToStreamMap.get(source);
      if (map) {
        map.delete(actionType);
      }
    }
  }
  actionTypes.forEach(unlistenToAction);
}

function filterForActions<T extends Action>(
  source: Observable<Action>,
  actionTypes: string[]
): Observable<T> {
  const allActions = __actionToStreamMap.get(source) as any; // This will always have a value

  const actionSubjects: Subject<T>[] = [];
  actionTypes.map(type => allActions.get(type)).forEach(element => {
    if (element) {
      actionSubjects.push(element);
    }
  });
  return merge(...actionSubjects);
}

function observeSource<T extends Action>(
  source: Observable<Action>,
  actionTypes: string[]
): Observable<T> {
  listenToActions(source, actionTypes);

  return new Observable<T>(subscriber => {
    subscribeToSource(source);

    const filterSubscription = filterForActions<T>(
      source,
      actionTypes
    ).subscribe(subscriber);

    return {
      unsubscribe() {
        unlistenToActions(source, actionTypes);
        unsubscribeFromSource(source);
        filterSubscription.unsubscribe();
      },
    };
  });
}

function ofTypeMap<T extends Action>(
  ...allowedTypes: string[]
): OperatorFunction<Action, T> {
  return function ofTypeOperatorFunction(source: Observable<Action>) {
    return observeSource<T>(source, allowedTypes);
  };
}

export function ofType<T extends Action>(
  ...allowedTypes: string[]
): OperatorFunction<Action, T> {
  if (supportsMapAndSet) {
    return ofTypeMap<T>(...allowedTypes);
  } else {
    return ofTypeBasic<T>(...allowedTypes);
  }
}

class OfTypeMetadata {
  constructor(private _source: Observable<any>) {}

  get watchedActions() {
    const map = __actionToStreamMap.get(this._source);
    const keys: string[] = [];
    if (map) {
      map.forEach((item, key) => keys.push(key));
    }
    return keys;
  }

  get subscriptionCount() {
    return __sourceSubscriptionsCount.get(this._source) || 0;
  }
}

export function getOfTypeMetadata(source: Observable<any>) {
  return new OfTypeMetadata(source);
}

export function forceBasicMode(force = true) {
  if (force) {
    supportsMapAndSet = false;
  } else {
    try {
      if (Map !== undefined && Set !== undefined) {
        supportsMapAndSet = true;
      }
    } catch {}
  }
}
