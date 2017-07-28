export type Comparer<T> = {
  (a: T, b: T): number;
};

export type IdSelector<T> = {
  (model: T): string;
};

export type Dictionary<T> = {
  [id: string]: T;
};

export type Update<T> = {
  id: string;
  changes: Partial<T>;
};

export interface EntityState<T> {
  ids: string[];
  entities: Dictionary<T>;
}

export interface EntityDefinition<T> {
  selectId: IdSelector<T>;
  sort: false | Comparer<T>;
}

export interface EntityStateAdapter<T> {
  addOne<S extends EntityState<T>>(entity: T, state: S): S;
  addMany<S extends EntityState<T>>(entities: T[], state: S): S;
  addAll<S extends EntityState<T>>(entities: T[], state: S): S;

  removeOne<S extends EntityState<T>>(key: string, state: S): S;
  removeMany<S extends EntityState<T>>(keys: string[], state: S): S;
  removeAll<S extends EntityState<T>>(state: S): S;

  updateOne<S extends EntityState<T>>(update: Update<T>, state: S): S;
  updateMany<S extends EntityState<T>>(updates: Update<T>[], state: S): S;
}

export type EntitySelectors<T, V> = {
  selectIds: (state: V) => string[];
  selectEntities: (state: V) => Dictionary<T>;
  selectAll: (state: V) => T[];
  selectTotal: (state: V) => number;
};

export interface EntityAdapter<T> extends EntityStateAdapter<T> {
  getInitialState(): EntityState<T>;
  getInitialState<S extends object>(state: S): EntityState<T> & S;
  getSelectors<V>(
    selectState: (state: V) => EntityState<T>
  ): EntitySelectors<T, V>;
}
