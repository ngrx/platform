import { RouterStateSnapshot } from '@angular/router';
export declare abstract class RouterStateSerializer<T> {
    abstract serialize(routerState: RouterStateSnapshot): T;
}
export declare class DefaultRouterStateSerializer implements RouterStateSerializer<RouterStateSnapshot> {
    serialize(routerState: RouterStateSnapshot): RouterStateSnapshot;
}
