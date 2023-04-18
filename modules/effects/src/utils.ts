import { InjectionToken, Type } from '@angular/core';

export function getSourceForInstance<T>(instance: T): T {
  return Object.getPrototypeOf(instance);
}

export function isClassInstance(obj: object): boolean {
  return (
    obj.constructor.name !== 'Object' && obj.constructor.name !== 'Function'
  );
}

export function isClass(
  classOrRecord: Type<unknown> | Record<string, unknown>
): classOrRecord is Type<unknown> {
  return typeof classOrRecord === 'function';
}

export function getClasses(
  classesAndRecords: Array<Type<unknown> | Record<string, unknown>>
): Type<unknown>[] {
  return classesAndRecords.filter(isClass);
}

export function isToken(
  tokenOrRecord:
    | Type<unknown>
    | InjectionToken<unknown>
    | Record<string, unknown>
): tokenOrRecord is Type<unknown> | InjectionToken<unknown> {
  return tokenOrRecord instanceof InjectionToken || isClass(tokenOrRecord);
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
