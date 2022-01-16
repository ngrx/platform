# Entity Adapter

## createEntityAdapter&lt;T&gt;

A method for returning a generic entity adapter for a single entity state collection. The
returned adapter provides many adapter methods for performing operations
against the collection type. The method takes an object with 2 properties for configuration.

- `selectId`: A method for selecting the primary id for the collection. Optional when the entity has a primary key of `id`
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
  selectedUserId: string | null;
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
import { Action, createReducer } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState&lt;User&gt; {
  // additional entities state properties
  selectedUserId: string | null;
}

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export const userReducer = createReducer(initialState);
</code-example>

## Adapter Collection Methods

The entity adapter also provides methods for operations against an entity. These methods can change
one to many records at a time. Each method returns the newly modified state if changes were made and the same
state if no changes were made.

- `addOne`: Add one entity to the collection.
- `addMany`: Add multiple entities to the collection.
- `setAll`: Replace current collection with provided collection.
- `setOne`: Add or Replace one entity in the collection.
- `setMany`: Add or Replace multiple entities in the collection.
- `removeOne`: Remove one entity from the collection.
- `removeMany`: Remove multiple entities from the collection, by id or by predicate.
- `removeAll`: Clear entity collection.
- `updateOne`: Update one entity in the collection. Supports partial updates.
- `updateMany`: Update multiple entities in the collection. Supports partial updates.
- `upsertOne`: Add or Update one entity in the collection.
- `upsertMany`: Add or Update multiple entities in the collection.
- `mapOne`: Update one entity in the collection by defining a map function.
- `map`: Update multiple entities in the collection by defining a map function, similar to [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Usage:

<code-example header="user.model.ts">
export interface User {
  id: string;
  name: string;
}
</code-example>

<code-example header="user.actions.ts">
import { createAction, props } from '@ngrx/store';
import { Update, EntityMap, EntityMapOne, Predicate } from '@ngrx/entity';

import { User } from '../models/user.model';

export const loadUsers = createAction('[User/API] Load Users', props<{ users: User[] }>());
export const setUsers = createAction('[User/API] Set Users', props<{ users: User[] }>());
export const addUser = createAction('[User/API] Add User', props<{ user: User }>());
export const setUser = createAction('[User/API] Set User', props<{ user: User }>());
export const upsertUser = createAction('[User/API] Upsert User', props<{ user: User }>());
export const addUsers = createAction('[User/API] Add Users', props<{ users: User[] }>());
export const upsertUsers = createAction('[User/API] Upsert Users', props<{ users: User[] }>());
export const updateUser = createAction('[User/API] Update User', props<{ update: Update&lt;User&gt; }>());
export const updateUsers = createAction('[User/API] Update Users', props<{ updates: Update&lt;User&gt;[] }>());
export const mapUser = createAction('[User/API] Map User', props<{ entityMap: EntityMapOne&lt;User&gt; }>());
export const mapUsers = createAction('[User/API] Map Users', props<{ entityMap: EntityMap&lt;User&gt; }>());
export const deleteUser = createAction('[User/API] Delete User', props<{ id: string }>());
export const deleteUsers = createAction('[User/API] Delete Users', props<{ ids: string[] }>());
export const deleteUsersByPredicate = createAction('[User/API] Delete Users By Predicate', props<{ predicate: Predicate&lt;User&gt; }>());
export const clearUsers = createAction('[User/API] Clear Users');

</code-example>

<code-example header="user.reducer.ts">
import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../models/user.model';
import * as UserActions from '../actions/user.actions';

export interface State extends EntityState&lt;User&gt; {
  // additional entities state properties
  selectedUserId: string | null;
}

export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.addUser, (state, { user }) => {
    return adapter.addOne(user, state)
  }),
  on(UserActions.setUser, (state, { user }) => {
    return adapter.setOne(user, state)
  }),
  on(UserActions.upsertUser, (state, { user }) => {
    return adapter.upsertOne(user, state);
  }),
  on(UserActions.addUsers, (state, { users }) => {
    return adapter.addMany(users, state);
  }),
  on(UserActions.upsertUsers, (state, { users }) => {
    return adapter.upsertMany(users, state);
  }),
  on(UserActions.updateUser, (state, { update }) => {
    return adapter.updateOne(update, state);
  }),
  on(UserActions.updateUsers, (state, { updates }) => {
    return adapter.updateMany(updates, state);
  }),
  on(UserActions.mapUser, (state, { entityMap }) => {
    return adapter.mapOne(entityMap, state);
  }),
  on(UserActions.mapUsers, (state, { entityMap }) => {
    return adapter.map(entityMap, state);
  }),
  on(UserActions.deleteUser, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),
  on(UserActions.deleteUsers, (state, { ids }) => {
    return adapter.removeMany(ids, state);
  }),
  on(UserActions.deleteUsersByPredicate, (state, { predicate }) => {
    return adapter.removeMany(predicate, state);
  }),
  on(UserActions.loadUsers, (state, { users }) => {
    return adapter.setAll(users, state);
  }),
  on(UserActions.setUsers, (state, { users }) => {
    return adapter.setMany(users, state);
  }),
  on(UserActions.clearUsers, state => {
    return adapter.removeAll({ ...state, selectedUserId: null });
  })
);


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

### Entity Updates

There are a few caveats to be aware of when updating entities using the entity adapter. 

The first is that `updateOne` and `updateMany` make use of the `Update<T>` interface shown below. This supports partial updates.

```typescript
interface UpdateStr<T> {
  id: string;
  changes: Partial<T>;
}

interface UpdateNum<T> {
  id: number;
  changes: Partial<T>;
}

type Update<T> = UpdateStr<T> | UpdateNum<T>;
```

Secondly, `upsertOne` and `upsertMany` will perform an insert or update. These methods do not support partial updates.

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
  fromUser.selectUserIds // shorthand for usersState => fromUser.selectUserIds(usersState)
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
  (userEntities, userId) => userId && userEntities[userId]
);
</code-example>
