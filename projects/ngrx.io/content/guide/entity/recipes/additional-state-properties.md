# Additional Entity State Properties Update

It's possible to add extra properties to a `State` extending from `EntityState`. These properties must be updated manually. Just like in a non-entity state, we can update the added properties in the reducer. This can be done with or without using the `@ngrx/entity` helper functions.

The steps below show you how to extend the [Entity Adapter](https://ngrx.io/guide/entity/adapter) example.

Usage:

Declare the `selectedUserId` as an additional property in the interface.

<code-example header="user.reducer.ts">
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState&lt;User&gt; {
  // additional state property
  selectedUserId: string | null;
}

export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;();
</code-example>

Then create an action to update the `selectedUserId`

<code-example header="user.actions.ts">
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from '../models/user.model';

export const selectUser = createAction('[Users Page] Select User', props&lt;{ userId: string }&gt;());
export const loadUsers = createAction('[User/API] Load Users', props&lt;{ users: User[] }&gt;());
</code-example>

The entity adapter is only used to update the `EntityState` properties. The additional state properties should be updated same as normal state properties, as the example below.

<code-example header="user.reducer.ts">
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import * as UserActions from '../actions/user.actions';

export interface State extends EntityState&lt;User&gt; {
  // additional state property
  selectedUserId: string | null;
}

export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.selectUser, (state, { userId }) => {
    return { ...state, selectedUserId: userId };
  }),
  on(UserActions.loadUsers, (state, { users }) => {
    return adapter.addMany(users, { ...state, selectedUserId: null });
  })
);

export function reducer(state: State | undefined, action: Action) {
  return userReducer(state, action);
}
</code-example>
