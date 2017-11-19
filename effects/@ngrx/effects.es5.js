var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var METADATA_KEY = '__@ngrx/effects__';
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
    var /** @type {?} */ constructor = sourceProto.constructor;
    var /** @type {?} */ meta = constructor.hasOwnProperty(METADATA_KEY)
        ? ((constructor))[METADATA_KEY]
        : Object.defineProperty(constructor, METADATA_KEY, { value: [] })[METADATA_KEY];
    Array.prototype.push.apply(meta, entries);
}
/**
 * @param {?=} __0
 * @return {?}
 */
function Effect(_a) {
    var dispatch = (_a === void 0 ? { dispatch: true } : _a).dispatch;
    return function (target, propertyName) {
        var /** @type {?} */ metadata = { propertyName: propertyName, dispatch: dispatch };
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
var getSourceMetadata = compose(getEffectMetadataEntries, getSourceForInstance);
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
function getEffectsMetadata(instance) {
    var /** @type {?} */ metadata = {};
    getSourceMetadata(instance).forEach(function (_a) {
        var propertyName = _a.propertyName, dispatch = _a.dispatch;
        metadata[propertyName] = { dispatch: dispatch };
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
var onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function isOnRunEffects(sourceInstance) {
    var /** @type {?} */ source = getSourceForInstance(sourceInstance);
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
    var /** @type {?} */ sourceName = getSourceForInstance(sourceInstance).constructor.name;
    var /** @type {?} */ observables = getSourceMetadata(sourceInstance).map(function (_a) {
        var propertyName = _a.propertyName, dispatch = _a.dispatch;
        var /** @type {?} */ observable = typeof sourceInstance[propertyName] === 'function'
            ? sourceInstance[propertyName]()
            : sourceInstance[propertyName];
        if (dispatch === false) {
            return ignoreElements$1.call(observable);
        }
        var /** @type {?} */ materialized$ = materialize$1.call(observable);
        return map$1.call(materialized$, function (notification) { return ({
            effect: sourceInstance[propertyName],
            notification: notification,
            propertyName: propertyName,
            sourceName: sourceName,
            sourceInstance: sourceInstance,
        }); });
    });
    return merge$1.apply(void 0, observables);
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function resolveEffectSource(sourceInstance) {
    var /** @type {?} */ mergedEffects$ = mergeEffects(sourceInstance);
    if (isOnRunEffects(sourceInstance)) {
        return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }
    return mergedEffects$;
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Actions = (function (_super) {
    __extends(Actions, _super);
    /**
     * @param {?=} source
     */
    function Actions(source) {
        var _this = _super.call(this) || this;
        if (source) {
            _this.source = source;
        }
        return _this;
    }
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    Actions.prototype.lift = function (operator) {
        var /** @type {?} */ observable = new Actions();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * @template V2
     * @param {...?} allowedTypes
     * @return {?}
     */
    Actions.prototype.ofType = function () {
        var allowedTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allowedTypes[_i] = arguments[_i];
        }
        return filter$1.call(this, function (action) { return allowedTypes.some(function (type) { return type === action.type; }); });
    };
    return Actions;
}(Observable$1));
Actions.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Actions.ctorParameters = function () { return [
    { type: Observable$1, decorators: [{ type: Inject, args: [ScannedActionsSubject,] },] },
]; };
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
        var /** @type {?} */ errorReason = "Effect " + getEffectName(output) + " threw an error";
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
        var /** @type {?} */ action = output.notification.value;
        var /** @type {?} */ isInvalidAction = !isAction(action);
        if (isInvalidAction) {
            var /** @type {?} */ errorReason = "Effect " + getEffectName(output) + " dispatched an invalid action";
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
function getEffectName(_a) {
    var propertyName = _a.propertyName, sourceInstance = _a.sourceInstance, sourceName = _a.sourceName;
    var /** @type {?} */ isMethod = typeof sourceInstance[propertyName] === 'function';
    return "\"" + sourceName + "." + propertyName + (isMethod ? '()' : '') + "\"";
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var IMMEDIATE_EFFECTS = new InjectionToken('ngrx/effects: Immediate Effects');
var ROOT_EFFECTS = new InjectionToken('ngrx/effects: Root Effects');
var FEATURE_EFFECTS = new InjectionToken('ngrx/effects: Feature Effects');
var CONSOLE = new InjectionToken('Browser Console');
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ErrorReporter = (function () {
    /**
     * @param {?} console
     */
    function ErrorReporter(console) {
        this.console = console;
    }
    /**
     * @param {?} reason
     * @param {?} details
     * @return {?}
     */
    ErrorReporter.prototype.report = function (reason, details) {
        this.console.group(reason);
        for (var /** @type {?} */ key in details) {
            this.console.error(key + ":", details[key]);
        }
        this.console.groupEnd();
    };
    return ErrorReporter;
}());
ErrorReporter.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ErrorReporter.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [CONSOLE,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var EffectSources = (function (_super) {
    __extends(EffectSources, _super);
    /**
     * @param {?} errorReporter
     */
    function EffectSources(errorReporter) {
        var _this = _super.call(this) || this;
        _this.errorReporter = errorReporter;
        return _this;
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    EffectSources.prototype.addEffects = function (effectSourceInstance) {
        this.next(effectSourceInstance);
    };
    /**
     * \@internal
     * @return {?}
     */
    EffectSources.prototype.toActions = function () {
        var _this = this;
        return mergeMap$1.call(groupBy$1.call(this, getSourceForInstance), function (source$) { return dematerialize$1.call(filter$1.call(map$1.call(exhaustMap$1.call(source$, resolveEffectSource), function (output) {
            verifyOutput(output, _this.errorReporter);
            return output.notification;
        }), function (notification) { return notification.kind === 'N'; })); });
    };
    return EffectSources;
}(Subject$1));
EffectSources.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EffectSources.ctorParameters = function () { return [
    { type: ErrorReporter, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var EffectsRunner = (function () {
    /**
     * @param {?} effectSources
     * @param {?} store
     */
    function EffectsRunner(effectSources, store$$1) {
        this.effectSources = effectSources;
        this.store = store$$1;
        this.effectsSubscription = null;
    }
    /**
     * @return {?}
     */
    EffectsRunner.prototype.start = function () {
        if (!this.effectsSubscription) {
            this.effectsSubscription = this.effectSources
                .toActions()
                .subscribe(this.store);
        }
    };
    /**
     * @return {?}
     */
    EffectsRunner.prototype.ngOnDestroy = function () {
        if (this.effectsSubscription) {
            this.effectsSubscription.unsubscribe();
            this.effectsSubscription = null;
        }
    };
    return EffectsRunner;
}());
EffectsRunner.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EffectsRunner.ctorParameters = function () { return [
    { type: EffectSources, },
    { type: Store, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ROOT_EFFECTS_INIT = '@ngrx/effects/init';
var EffectsRootModule = (function () {
    /**
     * @param {?} sources
     * @param {?} runner
     * @param {?} store
     * @param {?} rootEffects
     * @param {?} storeModule
     */
    function EffectsRootModule(sources, runner, store$$1, rootEffects, storeModule) {
        this.sources = sources;
        runner.start();
        rootEffects.forEach(function (effectSourceInstance) { return sources.addEffects(effectSourceInstance); });
        store$$1.dispatch({ type: ROOT_EFFECTS_INIT });
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    EffectsRootModule.prototype.addEffects = function (effectSourceInstance) {
        this.sources.addEffects(effectSourceInstance);
    };
    return EffectsRootModule;
}());
EffectsRootModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsRootModule.ctorParameters = function () { return [
    { type: EffectSources, },
    { type: EffectsRunner, },
    { type: Store, },
    { type: Array, decorators: [{ type: Inject, args: [ROOT_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var EffectsFeatureModule = (function () {
    /**
     * @param {?} root
     * @param {?} effectSourceGroups
     * @param {?} storeModule
     */
    function EffectsFeatureModule(root, effectSourceGroups, storeModule) {
        this.root = root;
        effectSourceGroups.forEach(function (group) { return group.forEach(function (effectSourceInstance) { return root.addEffects(effectSourceInstance); }); });
    }
    return EffectsFeatureModule;
}());
EffectsFeatureModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsFeatureModule.ctorParameters = function () { return [
    { type: EffectsRootModule, },
    { type: Array, decorators: [{ type: Inject, args: [FEATURE_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var EffectsModule = (function () {
    function EffectsModule() {
    }
    /**
     * @param {?} featureEffects
     * @return {?}
     */
    EffectsModule.forFeature = function (featureEffects) {
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
    };
    /**
     * @param {?} rootEffects
     * @return {?}
     */
    EffectsModule.forRoot = function (rootEffects) {
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
    };
    return EffectsModule;
}());
EffectsModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsModule.ctorParameters = function () { return []; };
/**
 * @param {...?} instances
 * @return {?}
 */
function createSourceInstances() {
    var instances = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        instances[_i] = arguments[_i];
    }
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
    return ((action)).payload;
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
//# sourceMappingURL=effects.es5.js.map
