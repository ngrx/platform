# Router Actions

Router Store provides five navigation actions which are dispatched in a specific order. The `routerReducer` provided by Router Store updates its state with the latest router state given by the actions. By default we recommend to use the creator functions we provide.

## Actions

### routerRequestAction

At the start of each navigation, the router will dispatch a `ROUTER_REQUEST` action.

### routerNavigationAction

During navigation, before any guards or resolvers run, the router will dispatch a `ROUTER_NAVIGATION` action.

If you want the `ROUTER_NAVIGATION` to be dispatched after guards or resolvers run, change the Navigation Action Timing.

### routerNavigatedAction

After a successful navigation, the router will dispatch a `ROUTER_NAVIGATED` action.

### routerCancelAction

When the navigation is cancelled, for example due to a guard saying that the user cannot access the requested page, the router will dispatch a `ROUTER_CANCEL` action.

The action contains the store state before the navigation. You can use it to restore the consistency of the store.

### routerErrorAction

When there is an error during navigation, the router will dispatch a `ROUTER_ERROR` action.

The action contains the store state before the navigation. You can use it to restore the consistency of the store.

<div class="alert is-important">

**Note:** You can also still use the action type, which was the previously defined way before action creators were introduced in NgRx. If you are looking for examples of the action types, visit the documentation for [versions 7.x and prior](https://v7.ngrx.io/guide/router-store/actions).

</div>

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
