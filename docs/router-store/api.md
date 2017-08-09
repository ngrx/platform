# API

## Custom Router State Serializer

During each navigation cycle, a `RouterNavigationAction` is dispatched with a snapshot of the state in its payload, the `RouterStateSnapshot`. The `RouterStateSnapshot` is a large complex structure, containing many pieces of information about the current state and what's rendered by the router. This can cause performance
issues when used with the Store Devtools. In most cases, you may only need a piece of information from the `RouterStateSnapshot`. In order to pair down the `RouterStateSnapshot` provided during navigation, you provide a custom serializer for the snapshot to only return what you need to be added to the payload and store.

To use the time-traveling debugging in the Devtools, you must return an object containing the `url` when using the `routerReducer`.

```ts
import { StoreModule } from '@ngrx/store';
import {
  StoreRouterConnectingModule,
  routerReducer,
  RouterStateSerializer,
  RouterStateSnapshotType
} from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;

    // Only return an object including the URL
    // instead of the entire snapshot
    return { url };
  }
}

@NgModule({
  imports: [
    StoreModule.forRoot({ routerReducer: routerReducer }),
    RouterModule.forRoot([
      // routes
    ]),
    StoreRouterConnectingModule
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ]
})
export class AppModule { }
```