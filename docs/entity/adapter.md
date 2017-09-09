# Entity Adapter

## createEntityAdapter<T>

A method for returning a generic entity adapter for a single entity state collection. The
returned adapter provides many [methods](#adapter-methods) for performing operations
against the collection type. The method takes an object for configuration with 2 properties.

 - `selectId`: A `method` for selecting the primary id for the collection
 - `sort`: A [sort function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) for sorting the collection. Set to `false` to leave collection unsorted.

Usage:

```ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: number;
  name: string;
  description: string;
}

export interface State extends EntityState<User> {
  // additional entities state properties
  selectedUserId: number;
}

export function sortByName(a: User, b: User): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sort: sortByName,
});
```

## Adapter Methods

These methods are provided by the adapter object returned
when using [createEntityAdapter](#createEntityAdapter). The methods are used inside your reducer function to manage
the entity collection based on your provided actions.

### getInitialState

Returns the `initialState` for entity state based on the provided type. Additional state is also provided through the provided configuration object. The initialState is provided to your reducer function.

Usage:

```ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: number;
  name: string;
  description: string;
}

export interface State extends EntityState<User> {
  // additional entities state properties
  selectedUserId: number | null;
}

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null
});

export function reducer(state = initialState, action): State {
  switch(action.type) {
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

* `addOne`: Add one entity to the collection
* `addMany`: Add multiple entities to the collection
* `addAll`: Replace current collection with provided collection
* `removeOne`: Remove one entity to the collection
* `removeMany`: Remove multiple entities to the collection
* `removeAll`: Clear entity collection
* `updateOne`: Update one entity in the collection
* `updateMany`: Update multiple entities in the collection

Usage:

`user.model.ts`

```ts
export interface User {
  id: number;
  name: string;
  description: string;
}
```

`user.actions.ts`

```ts
import { Action } from '@ngrx/action';
import { User } from './user.model';

export const LOAD_USERS = '[User] Load Users';
export const ADD_USER = '[User] Add User';
export const ADD_USERS = '[User] Add Users';
export const UPDATE_USER = '[User] Update User';
export const UPDATE_USERS = '[User] Update Users';
export const DELETE_USER = '[User] Delete User';
export const DELETE_USERS = '[User] Delete Users';
export const CLEAR_USERS = '[User] Clear Users';

export class LoadUsers implements Action {
  readonly type = LOAD_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class AddUser implements Action {
  readonly type = ADD_USER;

  constructor(public payload: { user: User }) {}
}

export class AddUsers implements Action {
  readonly type = ADD_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;

  constructor(public payload: { user: User }) {}
}

export class UpdateUsers implements Action {
  readonly type = UPDATE_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class DeleteUser implements Action {
  readonly type = DELETE_USER;

  constructor(public payload: { user: User }) {}
}

export class DeleteUsers implements Action {
  readonly type = DELETE_USERS;

  constructor(public payload: { users: User[] }) {}
}

export class ClearUsers implements Action {
  readonly type = CLEAR_USERS;
}

export type All =
 LoadUsers
 | AddUser
 | AddUsers
 | UpdateUser
 | UpdateUsers
 | DeleteUser
 | DeleteUsers
 | ClearUsers;
```

`user.reducer.ts`
```ts
import * as user from './user.actions';

export interface State extends EntityState<User> {
  // additional entities state properties
  selectedUserId: number | null;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sort: true,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null
});

export function reducer(
  state = initialState,
  action: UserActions.All
): State {
  switch (action.type) {        
    case user.ADD_USER: {
      return {
        ...state,
        ...adapter.addOne(action.payload.user, state),
      };
    }

    case user.ADD_USERS: {
      return {
        ...state,
        ...adapter.addMany(action.payload.users, state),
      };
    }

    case user.UPDATE_USER: {
      return {
        ...state,
        ...adapter.updateOne(action.payload.user, state),
      };
    }

    case user.UPDATE_USERS: {
      return {
        ...state,
        ...adapter.updateMany(action.payload.users, state),
      };
    }

    case user.LOAD_USERS: {
      return {
        ...state,
        ...adapter.addAll(action.payload.users, state),
      };
    }

    case user.CLEAR_USERS: {
      return {
        ...adapter.removeAll(state),
        selectedUserId: null
      };
    }        

    default: {
      return state;
    }    
  }
}

export const getSelectedUserId = (state: State) => state.selectedUserId;
```

### Entity Selectors

The `getSelectors` method returned by the created entity adapter provides functions for selecting information from the entity.

The `getSelectors` method takes a selector function
as its only argument to select the piece of state for a defined entity.

Usage:

`reducers/index.ts`

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export interface State {
  users: fromUser.State;
}

export const selectUserState =  createFeatureSelector<fromUser.State>('users');

export const {
  // select the array of user ids
  selectIds: getUserIds,

  // select the dictionary of user entities
  selectEntities: getUserEntities,

  // select the array of users
  selectAll: getAllUsers,

  // select the total user count
  selectTotal: getUserTotal
} = fromUser.adapter.getSelectors(selectUserState);

export const selectUserIds = createSelector(selectUserState, getUserIds);
export const selectUserEntities = createSelector(selectUserState, getUserEntities);
export const selectAllUsers = createSelector(selectUserState, getAllUsers);
export const selectUserCount = createSelector(selectUserState, getUserTotal);
export const selectCurrentUserId = createSelector(selectUserState, fromUser.getSelectedUserId);
export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectCurrentUserId,
  (userEntities, userId) => userEntities[userId]
);
```
