# Meta-reducers

`@ngrx/store` composes your map of reducers into a single reducer.

Developers can think of meta-reducers as hooks into the action->reducer pipeline. Meta-reducers allow developers to pre-process actions before _normal_ reducers are invoked.

Use the `metaReducers` configuration option to provide an array of meta-reducers that are composed from right to left.

**Note:** Meta-reducers in NgRx are similar to middleware used in Redux.

### Using a meta-reducer to log all actions

<ngrx-code-example header="app.module.ts">

```ts
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { reducers } from './reducers';

// console.log all actions
export function debug(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return function (state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [debug];

@NgModule({
  imports: [StoreModule.forRoot(reducers, { metaReducers })],
})
export class AppModule {}
```

</ngrx-code-example>
