# Entity Adapter

## createEntityAdapter<T>

A method for returning a generic entity adapter for a single entity state collection. The
returned adapter provides many adapter methods for performing operations
against the collection type. The method takes an object with 2 properties for configuration.

- `selectId`: A `method` for selecting the primary id for the collection.
- `sortComparer`: A compare function used to [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) the collection. The comparer function is only needed if the collection needs to be sorted before being displayed. Set to `false` to leave the collection unsorted, which is more performant during CRUD operations.

Usage:

```ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState<User> {
  // additional entities state properties
  selectedUserId: number;
}

export function sortByName(a: User, b: User): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  sortComparer: sortByName,
});
```

## Adapter Methods

These methods are provided by the adapter object returned
when using createEntityAdapter. The methods are used inside your reducer function to manage
the entity collection based on your provided actions.

### getInitialState

Returns the `initialState` for entity state based on the provided type. Additional state is also provided through the provided configuration object. The initialState is provided to your reducer function.

Usage:

```ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState<User> {
  // additional entities state properties
  selectedUserId: number | null;
}

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export function reducer(state = initialState, action): State {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
```

## Adapter Collection Methods

The entity adapter also provides methods for operations against an entity. These methods can change
one to many records at a time. Each method returns the newly modified state if changes were made and the same
state if no changes were made.

- `addOne`: Add one entity to the collection
- `addMany`: Add multiple entities to the collection
- `addAll`: Replace current collection with provided collection
- `removeOne`: Remove one entity from the collection
- `removeMany`: Remove multiple entities from the collection
- `removeAll`: Clear entity collection
- `updateOne`: Update one entity in the collection
- `updateMany`: Update multiple entities in the collection
- `upsertOne`: Add or Update one entity in the collection
- `upsertMany`: Add or Update multiple entities in the collection

Usage:

`user.model.ts`

```ts
export interface User {
  id: string;
  name: string;
}
```

`user.actions.ts`

```ts
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from './user.model';

export enum UserActionTypes {
  LOAD_USERS = '[User] Load Users',
  ADD_USER = '[User] Add User',
  UPSERT_USER = '[User] Upsert User',
  ADD_USERS = '[User] Add Users',
  UPSERT_USERS = '[User] Upsert Users',
  UPDATE_USER = '[User] Update User',
  UPDATE_USERS = '[User] Update Users',
  DELETE_USER = '[User] Delete User',
  DELETE_USERS = '[User] Delete Users',
  CLEAR_USERS = '[User] Clear Users',
}

export class LoadUsers implements Action {
  readonly type = UserActionTypes.LOAD_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class AddUser implements Action {
  readonly type = UserActionTypes.ADD_USER;

  constructor(public payload: { user: User }) {}
}

export class UpsertUser implements Action {
  readonly type = UserActionTypes.UPSERT_USER;

  constructor(public payload: { user: User }) {}
}

export class AddUsers implements Action {
  readonly type = UserActionTypes.ADD_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class UpsertUsers implements Action {
  readonly type = UserActionTypes.UPSERT_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UPDATE_USER;

  constructor(public payload: { user: Update<User> }) {}
}

export class UpdateUsers implements Action {
  readonly type = UserActionTypes.UPDATE_USERS;

  constructor(public payload: { users: Update<User>[] }) {}
}

export class DeleteUser implements Action {
  readonly type = UserActionTypes.DELETE_USER;

  constructor(public payload: { id: string }) {}
}

export class DeleteUsers implements Action {
  readonly type = UserActionTypes.DELETE_USERS;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearUsers implements Action {
  readonly type = UserActionTypes.CLEAR_USERS;
}

export type UserActionsUnion =
  | LoadUsers
  | AddUser
  | UpsertUser
  | AddUsers
  | UpsertUsers
  | UpdateUser
  | UpdateUsers
  | DeleteUser
  | DeleteUsers
  | ClearUsers;
```

`user.reducer.ts`

```ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from './user.model';
import { UserActionsUnion, UserActionTypes } from './user.actions';

export interface State extends EntityState<User> {
  // additional entities state properties
  selectedUserId: number | null;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export function reducer(state = initialState, action: UserActionsUnion): State {
  switch (action.type) {
    case UserActionTypes.ADD_USER: {
      return adapter.addOne(action.payload.user, state);
    }

    case UserActionTypes.UPSERT_USER: {
      return adapter.upsertOne(action.payload.user, state);
    }

    case UserActionTypes.ADD_USERS: {
      return adapter.addMany(action.payload.users, state);
    }

    case UserActionTypes.UPSERT_USERS: {
      return adapter.upsertMany(action.payload.users, state);
    }

    case UserActionTypes.UPDATE_USER: {
      return adapter.updateOne(action.payload.user, state);
    }

    case UserActionTypes.UPDATE_USERS: {
      return adapter.updateMany(action.payload.users, state);
    }

    case UserActionTypes.DELETE_USER: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UserActionTypes.DELETE_USERS: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UserActionTypes.LOAD_USERS: {
      return adapter.addAll(action.payload.users, state);
    }

    case UserActionTypes.CLEAR_USERS: {
      return adapter.removeAll({ ...state, selectedUserId: null });
    }

    default: {
      return state;
    }
  }
}

export const getSelectedUserId = (state: State) => state.selectedUserId;

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array of user ids
export const selectUserIds = selectIds;

// select the dictionary of user entities
export const selectUserEntities = selectEntities;

// select the array of users
export const selectAllUsers = selectAll;

// select the total user count
export const selectUserTotal = selectTotal;
```

### Entity Selectors

The `getSelectors` method returned by the created entity adapter provides functions for selecting information from the entity.

The `getSelectors` method takes a selector function as its only argument to select the piece of state for a defined entity.

Usage:

`reducers/index.ts`

```ts
import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromUser from './user.reducer';

export interface State {
  users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  users: fromUser.reducer,
};

export const selectUserState = createFeatureSelector<fromUser.State>('users');

export const selectUserIds = createSelector(
  selectUserState,
  fromUser.selectUserIds
);
export const selectUserEntities = createSelector(
  selectUserState,
  fromUser.selectUserEntities
);
export const selectAllUsers = createSelector(
  selectUserState,
  fromUser.selectAllUsers
);
export const selectUserTotal = createSelector(
  selectUserState,
  fromUser.selectUserTotal
);
export const selectCurrentUserId = createSelector(
  selectUserState,
  fromUser.getSelectedUserId
);

export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectCurrentUserId,
  (userEntities, userId) => userEntities[userId]
);
```
