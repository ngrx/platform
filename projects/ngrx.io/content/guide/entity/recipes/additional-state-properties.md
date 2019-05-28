# Additional Entity State Properties Update

It's possible to add extra properties to a `State` extending from `EntityState`. These properties must be updated manually. Just like in a non-entity state, we can update the added properties in the reducer. This can be done with or without using the `@ngrx/entity` helper functions.

In the below example we are going to use the [Entity Adapter](https://ngrx.io/guide/entity/adapter) example.

Usage:

we are declaring the `selectedUserId` as an additional entities state property.

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

...

export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;({
  ...
});
</code-example>

Then create an action to update the `selectedUserId`

<code-example header="user.actions.ts">
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from '../models/user.model';

...
export const selectUser = createAction('[User/API] Select User', props&lt;{ id: string }&gt;());
...
</code-example>

Entity Adapter is only used to update the `EntityState` properties. Other than that additional state properties should be updated same as normal state properties like below.

<code-example header="user.reducer.ts">
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
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
  ...
  on(UserActions.selectUser, state => {
    // update using entity helper function
    return adapter.addMany(action.users, { ...state, selectedUserId: action.id});
    OR
    // update without using entity helper function
    return { ...state, selectedUserId: action.id};
  }),
  ...
);

export const getSelectedUserId = (state: State) => state.selectedUserId;

</code-example>
