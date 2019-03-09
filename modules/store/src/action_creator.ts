// ==========
// = Adapted from: rex-tils
// = https://github.com/Hotell/rex-tils
// ==========

import { Action } from './models';

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<
  T extends string,
  P extends {
    [key: string]: any;
  }
>(type: T, props: P): Action<T, P>;
export function createAction<
  T extends string,
  P extends {
    [key: string]: any;
  }
>(type: T, props?: P) {
  /*
  The following line requires Typescript 3.2: Generic spread expressions in
  object literals. 
  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html
  
  Typescript 3.1.1 gives error: Spread types may only be created from 
  object types. ts(2698) 
  */
  // const action = payload === undefined ?{ type } : { type, ...payload };
  const action =
    props === undefined ? { type } : { type, ...(props as object) };
  return action;
}

/**
 * Use this type definition instead of `Function` type constructor
 */
type AnyFunction = (...args: any[]) => any;

/**
 * Simple alias to save keystrokes when defining JS typed object maps
 */
type StringMap<T> = { [key: string]: T };
export type ActionsUnion<A extends StringMap<AnyFunction>> = ReturnType<
  A[keyof A]
>;
