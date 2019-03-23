/////////////////
// Copied from `@ngrx/entity/models` because that lib doesn't export them
// They should be exported by @ngrx/entity

export type ComparerStr<T> = (a: T, b: T) => string;
export type ComparerNum<T> = (a: T, b: T) => number;
export type Comparer<T> = ComparerNum<T> | ComparerStr<T>;
export type IdSelectorStr<T> = (model: Partial<T>) => string;
export type IdSelectorNum<T> = (model: Partial<T>) => number;
export type IdSelector<T> = IdSelectorStr<T> | IdSelectorNum<T>;
export interface DictionaryNum<T> {
  [id: number]: T;
}
export abstract class Dictionary<T> implements DictionaryNum<T> {
  [id: string]: T;
}

export interface UpdateStr<T> {
  id: string;
  changes: Partial<T>;
}

export interface UpdateNum<T> {
  id: number;
  changes: Partial<T>;
}

/** Update entity data for an Update action */
export type Update<T> = UpdateStr<T> | UpdateNum<T>;
