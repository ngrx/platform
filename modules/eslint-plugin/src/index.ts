import { rules } from './rules';
import all from './configs/all.json';
import componentStore from './configs/component-store.json';
import effects from './configs/effects.json';
import store from './configs/store.json';
import operators from './configs/operators.json';
import signals from './configs/signals.json';

export = {
  configs: {
    all,
    'component-store': componentStore,
    effects: effects,
    store: store,
    operators: operators,
    signals: signals,
  },
  rules,
};
