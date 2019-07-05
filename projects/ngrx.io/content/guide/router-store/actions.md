# Router Actions

Router Store provides five navigation actions which are dispatched in a specific order. The `routerReducer` provided by Router Store updates its state with the latest router state given by the actions.

## Order of actions

Success case:

- `ROUTER_REQUEST`
- `ROUTER_NAVIGATION`
- `ROUTER_NAVIGATED`

Error / Cancel case (with early Navigation Action Timing):

- `ROUTER_REQUEST`
- `ROUTER_NAVIGATION`
- `ROUTER_CANCEL` / `ROUTER_ERROR`

Error / Cancel case (with late Navigation Action Timing):

- `ROUTER_REQUEST`
- `ROUTER_CANCEL` / `ROUTER_ERROR`

## Actions

### ROUTER_REQUEST

At the start of each navigation, the router will dispatch a `ROUTER_REQUEST` action.

### ROUTER_NAVIGATION

During navigation, before any guards or resolvers run, the router will dispatch a `ROUTER_NAVIGATION` action.

If you want the `ROUTER_NAVIGATION` to be dispatched after guards or resolvers run, change the Navigation Action Timing.

### ROUTER_NAVIGATED

After a successful navigation, the router will dispatch a `ROUTER_NAVIGATED` action.

### ROUTER_CANCEL

When the navigation is cancelled, for example due to a guard saying that the user cannot access the requested page, the router will dispatch a `ROUTER_CANCEL` action.

The action contains the store state before the navigation. You can use it to restore the consistency of the store.

### ROUTER_ERROR

When there is an error during navigation, the router will dispatch a `ROUTER_ERROR` action.

The action contains the store state before the navigation. You can use it to restore the consistency of the store.
