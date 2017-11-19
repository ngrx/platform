/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule } from "@angular/core";
import { EffectSources } from "./effect_sources";
import { Actions } from "./actions";
import { ROOT_EFFECTS, FEATURE_EFFECTS, CONSOLE } from "./tokens";
import { EffectsFeatureModule } from "./effects_feature_module";
import { EffectsRootModule } from "./effects_root_module";
import { EffectsRunner } from "./effects_runner";
import { ErrorReporter } from "./error_reporter";
export class EffectsModule {
    /**
     * @param {?} featureEffects
     * @return {?}
     */
    static forFeature(featureEffects) {
        return {
            ngModule: EffectsFeatureModule,
            providers: [
                featureEffects,
                {
                    provide: FEATURE_EFFECTS,
                    multi: true,
                    deps: featureEffects,
                    useFactory: createSourceInstances,
                },
            ],
        };
    }
    /**
     * @param {?} rootEffects
     * @return {?}
     */
    static forRoot(rootEffects) {
        return {
            ngModule: EffectsRootModule,
            providers: [
                EffectsRunner,
                EffectSources,
                ErrorReporter,
                Actions,
                rootEffects,
                {
                    provide: ROOT_EFFECTS,
                    deps: rootEffects,
                    useFactory: createSourceInstances,
                },
                {
                    provide: CONSOLE,
                    useFactory: getConsole,
                },
            ],
        };
    }
}
EffectsModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsModule.ctorParameters = () => [];
function EffectsModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    EffectsModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    EffectsModule.ctorParameters;
}
/**
 * @param {...?} instances
 * @return {?}
 */
export function createSourceInstances(...instances) {
    return instances;
}
/**
 * @return {?}
 */
export function getConsole() {
    return console;
}
//# sourceMappingURL=effects_module.js.map