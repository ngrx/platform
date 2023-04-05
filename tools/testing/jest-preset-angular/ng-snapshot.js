"use strict";
const attributesToRemovePatterns = ['__ngContext__'];
const ivyEnabled = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { NgModule } = require('@angular/core');

  class IvyModule {}
  NgModule()(IvyModule);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return true;
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
    const attributes = Object.keys(componentInstance).filter((key) => !attributesToRemovePatterns.includes(key));
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
const test = (val) => !!val && typeof val === 'object' && Object.prototype.hasOwnProperty.call(val, 'componentRef');
module.exports = {
    print,
    test,
};
