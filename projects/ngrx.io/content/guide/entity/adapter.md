# Entity Adapter

## createEntityAdapter&lt;T&gt;

A method for returning a generic entity adapter for a single entity state collection. The
returned adapter provides many adapter methods for performing operations
against the collection type. The method takes an object with 2 properties for configuration.

- `selectId`: A `method` for selecting the primary id for the collection. Optional when the entity has a primary key of `id`
- `sortComparer`: A compare function used to [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) the collection. The comparer function is only needed if the collection needs to be sorted before being displayed. Set to `false` to leave the collection unsorted, which is more performant during CRUD operations.

Usage:

<code-example header="user.reducer.ts">
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState&lt;User&gt; {
  // additional entities state properties
  selectedUserId: number;
}

export function selectUserId(a: User): string {
  //In this case this would be optional since primary key is id
  return a.id;
}

export function sortByName(a: User, b: User): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;({
  selectId: selectUserId,
  sortComparer: sortByName,
});
</code-example>

## Adapter Methods

These methods are provided by the adapter object returned
when using createEntityAdapter. The methods are used inside your reducer function to manage
the entity collection based on your provided actions.

### getInitialState

Returns the `initialState` for entity state based on the provided type. Additional state is also provided through the provided configuration object. The initialState is provided to your reducer function.

Usage:

<code-example header="user.reducer.ts">
import { createReducer } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState&lt;User&gt; {
  // additional entities state properties
  selectedUserId: number | null;
}

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export const reducer = createReducer(initialState);
</code-example>

## Adapter Collection Methods

The entity adapter also provides methods for operations against an entity. These methods can change
one to many records at a time. Each method returns the newly modified state if changes were made and the same
state if no changes were made.

- `addOne`: Add one entity to the collection
- `addMany`: Add multiple entities to the collection
- `addAll`: Replace current collection with provided collection
- `removeOne`: Remove one entity from the collection
- `removeMany`: Remove multiple entities from the collection, by id or by predicate
- `removeAll`: Clear entity collection
- `updateOne`: Update one entity in the collection
- `updateMany`: Update multiple entities in the collection
- `upsertOne`: Add or Update one entity in the collection
- `upsertMany`: Add or Update multiple entities in the collection
- `map`: Update multiple entities in the collection by defining a map function, similar to [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

Usage:

<code-example header="user.model.ts">
export interface User {
  id: string;
  name: string;
}
</code-example>

<code-example header="user.actions.ts">
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from '../models/user.model';

export const loadUsers = createAction('[User/API] Load Users', props&lt;{ users: User[] }&gt;());
export const addUser = createAction('[User/API] Add User', props&lt;{ user: User }&gt;());
export const upsertUser = createAction('[User/API] Upsert User', props&lt;{ user: User }&gt;());
export const addUsers = createAction('[User/API] Add Users', props&lt;{ user: User }&gt;());
export const upsertUsers = createAction('[User/API] Upsert Users', props&lt;{ users: User[] }&gt;());
export const updateUser = createAction('[User/API] Update User', props&lt;{ user: Update&lt;User&gt; }&gt;());
export const updateUsers = createAction('[User/API] Update Users', props&lt;{ users: Update&lt;User&gt;[] }&gt;());
export const mapUsers = createAction('[User/API] Map Users', props&lt;{ entityMap: EntityMap&lt;User&gt; }&gt;());
export const deleteUser = createAction('[User/API] Delete User', props&lt;{ id: string }&gt;());
export const deleteUsers = createAction('[User/API] Delete Users', props&lt;{ id: string[] }&gt;());
export const deleteUsersByPredicate = createAction('[User/API] Delete Users By Predicate', props&lt;{ predicate: Predicate&lt;User&gt; }&gt;());
export const clearUsers = createAction('[User/API] Clear Users');

</code-example>

<code-example header="user.reducer.ts">
import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../models/user.model';
import * as UserActions from '../actions/user.actions';

export interface State extends EntityState&lt;User&gt; {
  // additional entities state properties
  selectedUserId: number | null;
}

export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export const reducer = createReducer(initialState,
  on(UserActions.addUser, state => {
   return adapter.addOne(action.user, state)
  }),
  on(UserActions.upsertUser, state => {
    return adapter.upsertOne(action.user, state);
  }),
  on(UserActions.addUsers, state => {
    return adapter.addMany(action.users, state);
  }),
  on(UserActions.upsertUsers, state => {
    return adapter.upsertUsers(action.users, state);
  }),
  on(UserActions.updateUser, state => {
    return adapter.updateOne(action.user, state);
  }),
  on(UserActions.updateUsers, state => {
    return adapter.updateMany(action.users, state);
  }),
  on(UserActions.mapUsers, state => {
    return adapter.map(action.entityMap, state);
  }),
  on(UserActions.deleteUser, state => {
    return adapter.removeOne(action.ids, state);
  }),
  on(UserActions.deleteUsers, state => {
    return adapter.removeMany(action.ids, state);
  }),
  on(UserActions.deleteUsersByPredicate, state => {
    return adapter.removeMany(action.predicate, state);
  }),
  on(UserActions.loadUsers, state => {
    return adapter.addAll(action.users, state);
  }),
  on(UserActions.clearUsers, state => {
    return adapter.removeAll({ ...state, selectedUserId: null });
  }));

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
</code-example>

### Entity Selectors

The `getSelectors` method returned by the created entity adapter provides functions for selecting information from the entity.

The `getSelectors` method takes a selector function as its only argument to select the piece of state for a defined entity.

Usage:

<code-example header="index.ts">
import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromUser from './user.reducer';

export interface State {
  users: fromUser.State;
}

export const reducers: ActionReducerMap&lt;State&gt; = {
  users: fromUser.reducer,
};

export const selectUserState = createFeatureSelector&lt;fromUser.State&gt;('users');

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
</code-example>
