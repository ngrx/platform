import { computed, isSignal, Signal, untracked } from '@angular/core';
import {
  HasKnownRecordMember,
  IsKnownRecord,
  NonRecordMembers,
} from './ts-helpers';

const DEEP_SIGNAL = Symbol(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'DEEP_SIGNAL' : ''
);

export type DeepSignal<T> = Signal<T> &
  (IsKnownRecord<T> extends true
    ? Readonly<{ [K in keyof T]: DeepSignalOf<T[K]> }>
    : unknown);

export type DeepSignalOf<T> =
  HasKnownRecordMember<T> extends true
    ? DeepSignalRecordMembers<T> | DeepSignalNonRecordMembers<T>
    : Signal<T>;

type DeepSignalRecordMembers<T> = T extends unknown
  ? IsKnownRecord<T> extends true
    ? DeepSignal<T>
    : never
  : never;

type DeepSignalNonRecordMembers<T> = [NonRecordMembers<T>] extends [never]
  ? never
  : Signal<NonRecordMembers<T>>;

export function toDeepSignal<T>(signal: Signal<T>): DeepSignalOf<T> {
  return new Proxy(signal, {
    has(target: any, prop) {
      return !!this.get!(target, prop, undefined);
    },
    get(target: any, prop) {
      const value = untracked(target);
      if (!isRecord(value) || !(prop in value)) {
        if (isSignal(target[prop]) && (target[prop] as any)[DEEP_SIGNAL]) {
          delete target[prop];
        }

        return target[prop];
      }

      if (!isSignal(target[prop])) {
        Object.defineProperty(target, prop, {
          value: computed(() => target()[prop]),
          configurable: true,
        });
        target[prop][DEEP_SIGNAL] = true;
      }

      return toDeepSignal(target[prop]);
    },
  });
}

const nonRecords = [
  WeakSet,
  WeakMap,
  Promise,
  Date,
  Error,
  RegExp,
  ArrayBuffer,
  DataView,
  Function,
];

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || isIterable(value)) {
    return false;
  }

  let proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype) {
    return true;
  }

  while (proto && proto !== Object.prototype) {
    if (nonRecords.includes(proto.constructor)) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return proto === Object.prototype;
}

function isIterable(value: any): value is Iterable<any> {
  return typeof value?.[Symbol.iterator] === 'function';
}
