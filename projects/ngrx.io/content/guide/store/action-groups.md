# Action Groups

Action groups is a feature to group actions together that belong to the same source. While writing actions, the actions in most of the cases looks like below.

<code-example header="products-page.actions.ts">
import { createAction, props } from '@ngrx/store';

export const opened = createAction('[Products Page] Opened');

export const paginationChanged = createAction(
  '[Products Page] Pagination Changed',
  props&lt;{ page: number; offset: number }&gt;()
);

export const queryChanged = createAction(
  '[Products Page] Query Changed',
  (query: string) => ({ query })
);
</code-example>


In the example we can see that the source (`[Products Page])` is duplicated within each action. With the help of the `createActionGroup` API this can be avoided. 
The next example leverages `createActionGroup` to group actions together that belong to the same source. This makes that defining actions is more compact.

<code-example header="products-page.actions.ts">
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ProductsPageActions = createActionGroup({
  source: 'Products Page',
  events: {
    // defining an event without payload using the `emptyProps` function
    'Opened': emptyProps(),
    
    // defining an event with payload using the `props` function
    'Pagination Changed': props&lt;{ page: number; offset: number }&gt;(),
    
    // defining an event with payload using the props factory
    'Query Changed': (query: string) => ({ query }),
  }
});
</code-example>

To dispatch an action from the group, import the group and invoke an action.
This returns an action that you can then dispatch to the store.

```typescript

import { ProductsPageActions } from './products-page.actions';

@Component({ /* ... */ })
export class ProductsComponent implements OnInit {
  constructor(private readonly store: Store) {}

 ngOnInit(): void {
    // action type: [Products Page] Opened
    this.store.dispatch(ProductsPageActions.opened());
  }
  
  onPaginationChange(page: number, offset: number): void {
    // action type: [Products Page] Pagination Changed
    this.store.dispatch(ProductsPageActions.paginationChanged({ page, offset }));
  }
  
  onQueryChange(query: string): void {
    // action type: [Products Page] Query Changed
    this.store.dispatch(ProductsPageActions.queryChanged(query));
  }
}

```

## Limitations

An action group uses the event names to create properties within the group that represent the action creators. 
The action creator names are generated and are the camelCased version of the event names.
For example, for the event name `Query Changed`, the action creator name will be `queryChanged`.
Therefore, it is not possible to define action creators whose names differ from their event names using the `createActionGroup` function.

You can read more about Action Groups:

- [NgRx Action Group Creator](https://dev.to/ngrx/ngrx-action-group-creator-1deh)
- [Creating Actions with NgRx Just Got Even Easier](https://www.youtube.com/watch?v=rk83ZMqEDV4)
