// component-store
import avoidCombiningComponentStoreSelectors from './component-store/avoid-combining-component-store-selectors';
import avoidMappingComponentStoreSelectors from './component-store/avoid-mapping-component-store-selectors';
import updaterExplicitReturnType from './component-store/updater-explicit-return-type';
// effects
import avoidCyclicEffects from './effects/avoid-cyclic-effects';
import noDispatchInEffects from './effects/no-dispatch-in-effects';
import noEffectsInProviders from './effects/no-effects-in-providers';
import noMultipleActionsInEffects from './effects/no-multiple-actions-in-effects';
import preferActionCreatorInOfType from './effects/prefer-action-creator-in-of-type';
import preferEffectCallbackInBlockStatement from './effects/prefer-effect-callback-in-block-statement';
import useEffectsLifecycleInterface from './effects/use-effects-lifecycle-interface';
// store
import avoidCombiningSelectors from './store/avoid-combining-selectors';
import avoidDispatchingMultipleActionsSequentially from './store/avoid-dispatching-multiple-actions-sequentially';
import avoidDuplicateActionsInReducer from './store/avoid-duplicate-actions-in-reducer';
import avoidMappingSelectors from './store/avoid-mapping-selectors';
import goodActionHygiene from './store/good-action-hygiene';
import noMultipleGlobalStores from './store/no-multiple-global-stores';
import noReducerInKeyNames from './store/no-reducer-in-key-names';
import noStoreSubscription from './store/no-store-subscription';
import noTypedGlobalStore from './store/no-typed-global-store';
import onFunctionExplicitReturnType from './store/on-function-explicit-return-type';
import preferActionCreator from './store/prefer-action-creator';
import preferActionCreatorInDispatch from './store/prefer-action-creator-in-dispatch';
import preferInlineActionProps from './store/prefer-inline-action-props';
import preferOneGenericInCreateForFeatureSelector from './store/prefer-one-generic-in-create-for-feature-selector';
import preferSelectorInSelect from './store/prefer-selector-in-select';
import prefixSelectorsWithSelect from './store/prefix-selectors-with-select';
import selectStyle from './store/select-style';
import useConsistentGlobalStoreName from './store/use-consistent-global-store-name';
// operators
import preferConcatLatestFrom from './operators/prefer-concat-latest-from';
// signals
import signalStateNoArraysAtRootLevel from './signals/signal-state-no-arrays-at-root-level';
import signalStoreFeatureShouldUseGenericType from './signals/signal-store-feature-should-use-generic-type';
import withStateNoArraysAtRootLevel from './signals/with-state-no-arrays-at-root-level';

export const rules = {
  // component-store
  'avoid-combining-component-store-selectors':
    avoidCombiningComponentStoreSelectors,
  'avoid-mapping-component-store-selectors':
    avoidMappingComponentStoreSelectors,
  'updater-explicit-return-type': updaterExplicitReturnType,
  //effects
  'avoid-cyclic-effects': avoidCyclicEffects,
  'no-dispatch-in-effects': noDispatchInEffects,
  'no-effects-in-providers': noEffectsInProviders,
  'no-multiple-actions-in-effects': noMultipleActionsInEffects,
  'prefer-action-creator-in-of-type': preferActionCreatorInOfType,
  'prefer-effect-callback-in-block-statement':
    preferEffectCallbackInBlockStatement,
  'use-effects-lifecycle-interface': useEffectsLifecycleInterface,
  // store
  'avoid-combining-selectors': avoidCombiningSelectors,
  'avoid-dispatching-multiple-actions-sequentially':
    avoidDispatchingMultipleActionsSequentially,
  'avoid-duplicate-actions-in-reducer': avoidDuplicateActionsInReducer,
  'avoid-mapping-selectors': avoidMappingSelectors,
  'good-action-hygiene': goodActionHygiene,
  'no-multiple-global-stores': noMultipleGlobalStores,
  'no-reducer-in-key-names': noReducerInKeyNames,
  'no-store-subscription': noStoreSubscription,
  'no-typed-global-store': noTypedGlobalStore,
  'on-function-explicit-return-type': onFunctionExplicitReturnType,
  'prefer-action-creator': preferActionCreator,
  'prefer-action-creator-in-dispatch': preferActionCreatorInDispatch,
  'prefer-inline-action-props': preferInlineActionProps,
  'prefer-one-generic-in-create-for-feature-selector':
    preferOneGenericInCreateForFeatureSelector,
  'prefer-selector-in-select': preferSelectorInSelect,
  'prefix-selectors-with-select': prefixSelectorsWithSelect,
  'select-style': selectStyle,
  'use-consistent-global-store-name': useConsistentGlobalStoreName,
  // operators
  'prefer-concat-latest-from': preferConcatLatestFrom,
  // signals
  'signal-state-no-arrays-at-root-level': signalStateNoArraysAtRootLevel,
  'signal-store-feature-should-use-generic-type':
    signalStoreFeatureShouldUseGenericType,
  'with-state-no-arrays-at-root-level': withStateNoArraysAtRootLevel,
};
