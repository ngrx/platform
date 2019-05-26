# Additional Entity State Properties Update

 For beginners it is very confusing how to update the additional state properties using adapter. So we are going to see how to update the Additional Entity state properties. In the below example we are going to use the [Entity Adapter](https://ngrx.io/guide/entity/adapter) example.

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
import { createAction, props, union } from '@ngrx/store';
import { Update } from '@ngrx/entity';

 import { User } from '../models/user.model';

 ...

 export const selectUser = createAction('[User/API] Select User', props&lt;{ id: string }&gt;());

 ...

 const all = union({
  ...
  selectUser,
  ...
});
export type Union = typeof all;
</code-example>

 Entity Adapter is only used to update the `EntityState` properties. Other than that additional state properties should be updated same as normal state properties like below.

 <code-example header="user.reducer.ts">
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

 export function reducer(state = initialState, action: UserActions.Union): State {
  switch (action.type) {
    ...

     case UserActions.selectUser.type: {
      return { ...state, selectedUserId: action.id};
    }

     ...
  }
}

 export const getSelectedUserId = (state: State) => state.selectedUserId;

 </code-example>
