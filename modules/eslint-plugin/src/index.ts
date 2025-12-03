import { rules } from './rules';
import all from './configs/all.json';
import allTypeChecked from './configs/all-type-checked';
import componentStore from './configs/component-store.json';
import effects from './configs/effects.json';
import effectsTypeChecked from './configs/effects-type-checked';
import store from './configs/store.json';
import operators from './configs/operators.json';
import signals from './configs/signals.json';
import signalsTypeChecked from './configs/signals-type-checked';

export = {
  configs: {
    all,
    'all-type-checked': allTypeChecked,
    'component-store': componentStore,
    effects: effects,
    'effects-type-checked': effectsTypeChecked,
    store: store,
    operators: operators,
    signals: signals,
    'signals-type-checked': signalsTypeChecked,
  },
  rules,
};
