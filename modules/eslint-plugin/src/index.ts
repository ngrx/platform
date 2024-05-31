import { rules } from './rules';
import all from './configs/all.json';
import recommended from './configs/recommended.json';
import componentStoreRecommended from './configs/component-store-recommended.json';
import componentStoreAll from './configs/component-store-all.json';
import effectsRecommended from './configs/effects-recommended.json';
import effectsAll from './configs/effects-all.json';
import storeRecommended from './configs/store-recommended.json';
import storeAll from './configs/store-all.json';

export = {
  configs: {
    all,
    recommended,
    'component-store-recommended': componentStoreRecommended,
    'component-store-all': componentStoreAll,
    'effects-recommended': effectsRecommended,
    'effects-all': effectsAll,
    'store-recommended': storeRecommended,
    'store-all': storeAll,
  },
  rules,
};
