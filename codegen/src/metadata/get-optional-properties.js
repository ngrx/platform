/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} props
 * @return {?}
 */
export function getOptionalProperties(props) {
    return props.filter(prop => prop.questionToken).map(prop => ({
        name: prop.name.getText(),
        required: false,
    }));
}
//# sourceMappingURL=get-optional-properties.js.map