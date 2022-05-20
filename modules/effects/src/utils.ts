export function getSourceForInstance<T>(instance: T): T {
  return Object.getPrototypeOf(instance);
}

// TODO: replace with RxJS interfaces when possible
// needs dependency on RxJS >=7
export interface NextNotification<T> {
  kind: 'N';
  value: T;
}

export interface ErrorNotification {
  kind: 'E';
  error: any;
}

export interface CompleteNotification {
  kind: 'C';
}

export type ObservableNotification<T> =
  | NextNotification<T>
  | ErrorNotification
  | CompleteNotification;
