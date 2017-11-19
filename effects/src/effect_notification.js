/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
export function EffectNotification() { }
function EffectNotification_tsickle_Closure_declarations() {
    /** @type {?} */
    EffectNotification.prototype.effect;
    /** @type {?} */
    EffectNotification.prototype.propertyName;
    /** @type {?} */
    EffectNotification.prototype.sourceName;
    /** @type {?} */
    EffectNotification.prototype.sourceInstance;
    /** @type {?} */
    EffectNotification.prototype.notification;
}
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
export function verifyOutput(output, reporter) {
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
//# sourceMappingURL=effect_notification.js.map