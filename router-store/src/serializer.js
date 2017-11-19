/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
export class RouterStateSerializer {
}
function RouterStateSerializer_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} routerState
     * @return {?}
     */
    RouterStateSerializer.prototype.serialize = function (routerState) { };
}
export class DefaultRouterStateSerializer {
    /**
     * @param {?} routerState
     * @return {?}
     */
    serialize(routerState) {
        return routerState;
    }
}
//# sourceMappingURL=serializer.js.map