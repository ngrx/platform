/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} props
 * @return {?}
 */
export function getRequiredProperties(props) {
    return props
        .filter(prop => !prop.questionToken)
        .map(prop => ({
        name: prop.name.getText(),
        required: true,
    }))
        .filter(({ name }) => name !== 'type');
}
//# sourceMappingURL=get-required-properties.js.map