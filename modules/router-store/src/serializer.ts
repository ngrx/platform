import { InjectionToken } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';

export abstract class RouterStateSerializer<T> {
  abstract serialize(routerState: RouterStateSnapshot): T;
}

export class DefaultRouterStateSerializer
  implements RouterStateSerializer<RouterStateSnapshot> {
  serialize(routerState: RouterStateSnapshot) {
    return routerState;
  }
}
