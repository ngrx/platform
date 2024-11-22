import { Signal } from '@angular/core';
import { signalState } from './signal-state';

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type IsRecord<T> = T extends object
  ? T extends unknown[]
    ? false
    : T extends Set<unknown>
    ? false
    : T extends Map<unknown, unknown>
    ? false
    : T extends Function
    ? false
    : T extends { prototype: unknown } // check for constructor did not work
    ? false
    : T extends { [key: string]: unknown }
    ? true
    : false
  : false;

export type IsUnknownRecord<T> = string extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false;

export type IsKnownRecord<T> = IsRecord<T> extends true
  ? IsUnknownRecord<T> extends true
    ? false
    : true
  : false;

export type OmitPrivate<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

class User {
  id = 0;
  name = 'Konrad';
}

const state = {
  user: new User(),
  id: 1,
  address: { city: 'Wien', zip: '1040' },
};

type AssertFalse<T extends false> = T;
type AssertTrue<T extends true> = T;

type T1 = AssertFalse<IsRecord<User>>;
type T2 = AssertFalse<IsRecord<typeof state.id>>;
type T3 = AssertTrue<IsRecord<typeof state.address>>;

const store = signalState(state);
const address: Signal<{ city: string; zip: string }> = store.address;
const user: Signal<User> = store.user;
const zip: Signal<string> = store.address.zip;
const id: Signal<number> = store.id;
