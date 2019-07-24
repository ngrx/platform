import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

export type subjectFactory = () => Subject<any>;

export function getSubjectFactory<T>(): subjectFactory {
  return () => new Subject<T>();
}

export function behaviourSubjectFactory<T>(init: T): subjectFactory {
  return () => new BehaviorSubject(init);
}

export function getReplaySubjectFactory<T>(bufferSize = 1): subjectFactory {
  return () => new ReplaySubject<T>(bufferSize);
}

export function getAsyncSubjectFactory<T>(): subjectFactory {
  return () => new AsyncSubject<T>();
}

export function getPropertySubject<T = any>(
  // tslint:disable-next-line
  objInstance: Object | any,
  property: PropertyKey,
  sFactory: () => Subject<T> = getReplaySubjectFactory(1),
  subProperty: PropertyKey = ''
): Subject<T> {
  if (subProperty === '') {
    return objInstance[property] || (objInstance[property] = sFactory());
  } else {
    if (!objInstance[property]) {
      objInstance[property] = {};
    }
    return (
      objInstance[property][subProperty] ||
      (objInstance[property][subProperty] = sFactory())
    );
  }
}
