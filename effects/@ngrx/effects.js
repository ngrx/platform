import { ScannedActionsSubject, Store, StoreModule, compose } from '@ngrx/store';
import { merge as merge$1 } from 'rxjs/observable/merge';
import { ignoreElements as ignoreElements$1 } from 'rxjs/operator/ignoreElements';
import { materialize as materialize$1 } from 'rxjs/operator/materialize';
import { map as map$1 } from 'rxjs/operator/map';
import { Inject, Injectable, InjectionToken, NgModule, Optional } from '@angular/core';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { filter as filter$1 } from 'rxjs/operator/filter';
import { groupBy as groupBy$1 } from 'rxjs/operator/groupBy';
import { mergeMap as mergeMap$1 } from 'rxjs/operator/mergeMap';
import { exhaustMap as exhaustMap$1 } from 'rxjs/operator/exhaustMap';
import { dematerialize as dematerialize$1 } from 'rxjs/operator/dematerialize';
import { Subject as Subject$1 } from 'rxjs/Subject';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const METADATA_KEY = '__@ngrx/effects__';
/**
 * @record
 */

/**
 * @param {?} sourceProto
 * @return {?}
 */
function getEffectMetadataEntries(sourceProto) {
    return sourceProto.constructor[METADATA_KEY] || [];
}
/**
 * @param {?} sourceProto
 * @param {?} entries
 * @return {?}
 */
function setEffectMetadataEntries(sourceProto, entries) {
    const /** @type {?} */ constructor = sourceProto.constructor;
    const /** @type {?} */ meta = constructor.hasOwnProperty(METADATA_KEY)
        ? (/** @type {?} */ (constructor))[METADATA_KEY]
        : Object.defineProperty(constructor, METADATA_KEY, { value: [] })[METADATA_KEY];
    Array.prototype.push.apply(meta, entries);
}
/**
 * @param {?=} __0
 * @return {?}
 */
function Effect({ dispatch } = { dispatch: true }) {
    return function (target, propertyName) {
        const /** @type {?} */ metadata = { propertyName, dispatch };
        setEffectMetadataEntries(target, [metadata]);
    };
}
/**
 * @param {?} instance
 * @return {?}
 */
function getSourceForInstance(instance) {
    return Object.getPrototypeOf(instance);
}
const getSourceMetadata = compose(getEffectMetadataEntries, getSourceForInstance);
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
function getEffectsMetadata(instance) {
    const /** @type {?} */ metadata = {};
    getSourceMetadata(instance).forEach(({ propertyName, dispatch }) => {
        metadata[propertyName] = { dispatch };
    });
    return metadata;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

const onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function isOnRunEffects(sourceInstance) {
    const /** @type {?} */ source = getSourceForInstance(sourceInstance);
    return (onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function mergeEffects(sourceInstance) {
    const /** @type {?} */ sourceName = getSourceForInstance(sourceInstance).constructor.name;
    const /** @type {?} */ observables = getSourceMetadata(sourceInstance).map(({ propertyName, dispatch }) => {
        const /** @type {?} */ observable = typeof sourceInstance[propertyName] === 'function'
            ? sourceInstance[propertyName]()
            : sourceInstance[propertyName];
        if (dispatch === false) {
            return ignoreElements$1.call(observable);
        }
        const /** @type {?} */ materialized$ = materialize$1.call(observable);
        return map$1.call(materialized$, (notification) => ({
            effect: sourceInstance[propertyName],
            notification,
            propertyName,
            sourceName,
            sourceInstance,
        }));
    });
    return merge$1(...observables);
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function resolveEffectSource(sourceInstance) {
    const /** @type {?} */ mergedEffects$ = mergeEffects(sourceInstance);
    if (isOnRunEffects(sourceInstance)) {
        return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }
    return mergedEffects$;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Actions extends Observable$1 {
    /**
     * @param {?=} source
     */
    constructor(source) {
        super();
        if (source) {
            this.source = source;
        }
    }
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    lift(operator) {
        const /** @type {?} */ observable = new Actions();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    /**
     * @template V2
     * @param {...?} allowedTypes
     * @return {?}
     */
    ofType(...allowedTypes) {
        return filter$1.call(this, (action) => allowedTypes.some(type => type === action.type));
    }
}
Actions.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Actions.ctorParameters = () => [
    { type: Observable$1, decorators: [{ type: Inject, args: [ScannedActionsSubject,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
function verifyOutput(output, reporter) {
    reportErrorThrown(output, reporter);
    reportInvalidActions(output, reporter);
}
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
function reportErrorThrown(output, reporter) {
    if (output.notification.kind === 'E') {
        const /** @type {?} */ errorReason = `Effect ${getEffectName(output)} threw an error`;
        reporter.report(errorReason, {
            Source: output.sourceInstance,
            Effect: output.effect,
            Error: output.notification.error,
            Notification: output.notification,
        });
    }
}
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
function reportInvalidActions(output, reporter) {
    if (output.notification.kind === 'N') {
        const /** @type {?} */ action = output.notification.value;
        const /** @type {?} */ isInvalidAction = !isAction(action);
        if (isInvalidAction) {
            const /** @type {?} */ errorReason = `Effect ${getEffectName(output)} dispatched an invalid action`;
            reporter.report(errorReason, {
                Source: output.sourceInstance,
                Effect: output.effect,
                Dispatched: action,
                Notification: output.notification,
            });
        }
    }
}
/**
 * @param {?} action
 * @return {?}
 */
function isAction(action) {
    return action && action.type && typeof action.type === 'string';
}
/**
 * @param {?} __0
 * @return {?}
 */
function getEffectName({ propertyName, sourceInstance, sourceName, }) {
    const /** @type {?} */ isMethod = typeof sourceInstance[propertyName] === 'function';
    return `"${sourceName}.${propertyName}${isMethod ? '()' : ''}"`;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const IMMEDIATE_EFFECTS = new InjectionToken('ngrx/effects: Immediate Effects');
const ROOT_EFFECTS = new InjectionToken('ngrx/effects: Root Effects');
const FEATURE_EFFECTS = new InjectionToken('ngrx/effects: Feature Effects');
const CONSOLE = new InjectionToken('Browser Console');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ErrorReporter {
    /**
     * @param {?} console
     */
    constructor(console) {
        this.console = console;
    }
    /**
     * @param {?} reason
     * @param {?} details
     * @return {?}
     */
    report(reason, details) {
        this.console.group(reason);
        for (let /** @type {?} */ key in details) {
            this.console.error(`${key}:`, details[key]);
        }
        this.console.groupEnd();
    }
}
ErrorReporter.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ErrorReporter.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONSOLE,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EffectSources extends Subject$1 {
    /**
     * @param {?} errorReporter
     */
    constructor(errorReporter) {
        super();
        this.errorReporter = errorReporter;
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.next(effectSourceInstance);
    }
    /**
     * \@internal
     * @return {?}
     */
    toActions() {
        return mergeMap$1.call(groupBy$1.call(this, getSourceForInstance), (source$) => dematerialize$1.call(filter$1.call(map$1.call(exhaustMap$1.call(source$, resolveEffectSource), (output) => {
            verifyOutput(output, this.errorReporter);
            return output.notification;
        }), (notification) => notification.kind === 'N')));
    }
}
EffectSources.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EffectSources.ctorParameters = () => [
    { type: ErrorReporter, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EffectsRunner {
    /**
     * @param {?} effectSources
     * @param {?} store
     */
    constructor(effectSources, store$$1) {
        this.effectSources = effectSources;
        this.store = store$$1;
        this.effectsSubscription = null;
    }
    /**
     * @return {?}
     */
    start() {
        if (!this.effectsSubscription) {
            this.effectsSubscription = this.effectSources
                .toActions()
                .subscribe(this.store);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.effectsSubscription) {
            this.effectsSubscription.unsubscribe();
            this.effectsSubscription = null;
        }
    }
}
EffectsRunner.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EffectsRunner.ctorParameters = () => [
    { type: EffectSources, },
    { type: Store, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const ROOT_EFFECTS_INIT = '@ngrx/effects/init';
class EffectsRootModule {
    /**
     * @param {?} sources
     * @param {?} runner
     * @param {?} store
     * @param {?} rootEffects
     * @param {?} storeModule
     */
    constructor(sources, runner, store$$1, rootEffects, storeModule) {
        this.sources = sources;
        runner.start();
        rootEffects.forEach(effectSourceInstance => sources.addEffects(effectSourceInstance));
        store$$1.dispatch({ type: ROOT_EFFECTS_INIT });
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.sources.addEffects(effectSourceInstance);
    }
}
EffectsRootModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsRootModule.ctorParameters = () => [
    { type: EffectSources, },
    { type: EffectsRunner, },
    { type: Store, },
    { type: Array, decorators: [{ type: Inject, args: [ROOT_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EffectsFeatureModule {
    /**
     * @param {?} root
     * @param {?} effectSourceGroups
     * @param {?} storeModule
     */
    constructor(root, effectSourceGroups, storeModule) {
        this.root = root;
        effectSourceGroups.forEach(group => group.forEach(effectSourceInstance => root.addEffects(effectSourceInstance)));
    }
}
EffectsFeatureModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsFeatureModule.ctorParameters = () => [
    { type: EffectsRootModule, },
    { type: Array, decorators: [{ type: Inject, args: [FEATURE_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EffectsModule {
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
/**
 * @param {...?} instances
 * @return {?}
 */
function createSourceInstances(...instances) {
    return instances;
}
/**
 * @return {?}
 */
function getConsole() {
    return console;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @deprecated Since version 4.1. Will be deleted in version 5.0.
 * @param {?} action
 * @return {?}
 */
function toPayload(action) {
    return (/** @type {?} */ (action)).payload;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { Effect, getEffectsMetadata, mergeEffects, Actions, EffectsModule, EffectSources, toPayload, ROOT_EFFECTS_INIT, EffectsFeatureModule as ɵd, createSourceInstances as ɵa, getConsole as ɵb, EffectsRootModule as ɵc, EffectsRunner as ɵi, ErrorReporter as ɵh, CONSOLE as ɵg, FEATURE_EFFECTS as ɵf, ROOT_EFFECTS as ɵe };
//# sourceMappingURL=effects.js.map
