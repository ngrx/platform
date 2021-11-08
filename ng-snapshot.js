"use strict";
const ivyEnabled = () => {
    const { ɵivyEnabled } = require('@angular/core');
    return ɵivyEnabled;
};
const print = (fixture, print, indent, opts, colors) => {
    var _a, _b;
    let nodes = '';
    let componentAttrs = '';
    let componentName = '';
    const componentRef = fixture.componentRef;
    const componentInstance = fixture.componentInstance;
    if (ivyEnabled()) {
        const componentDef = componentRef.componentType.ɵcmp;
        componentName = componentDef.selectors[0][0];
        nodes = Array.from(componentRef.location.nativeElement.childNodes).map(print).join('');
    }
    else {
        componentName = (_a = componentRef._elDef.element) === null || _a === void 0 ? void 0 : _a.name;
        nodes = ((_b = componentRef._view.nodes) !== null && _b !== void 0 ? _b : [])
            .filter((node) => node === null || node === void 0 ? void 0 : node.hasOwnProperty('renderElement'))
            .map((node) => Array.from(node.renderElement.childNodes).map(print).join(''))
            .join(opts.edgeSpacing);
    }
    const attributes = Object.keys(componentInstance);
    if (attributes.length) {
        componentAttrs += attributes
            .sort()
            .map((attribute) => {
            const compAttrVal = componentInstance[attribute];
            return (opts.spacing +
                indent(`${colors.prop.open}${attribute}${colors.prop.close}=`) +
                colors.value.open +
                (compAttrVal && compAttrVal.constructor
                    ? `{[Function ${compAttrVal.constructor.name}]}`
                    : `"${compAttrVal}"`) +
                colors.value.close);
        })
            .join('');
    }
    return ('<' +
        componentName +
        componentAttrs +
        (componentAttrs.length ? '\n' : '') +
        '>\n' +
        indent(nodes) +
        '\n</' +
        componentName +
        '>').replace(/\n^\s*\n/gm, '\n');
};
/**
 * This change is from https://github.com/thymikee/jest-preset-angular/commit/59ef5ba0e4617ad7cb0ca8b60d119efea107fddc
 * which causes toMatchSnapshot tests to break for reducers
 * Reverted locally as temp fix
 */
// const test = (val) => typeof val === 'object' && Object.prototype.hasOwnProperty.call(val, 'componentRef');
const test = (val) =>
  val !== undefined &&
  val !== null &&
  typeof val === 'object' &&
  Object.prototype.hasOwnProperty.call(val, 'componentRef');
  typeof val === 'object' && Object.prototype.hasOwnProperty.call(val, 'componentRef');
module.exports = {
    print,
    test,
};
