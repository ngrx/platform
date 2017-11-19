import { StoreModule, Store } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
export declare const ROOT_EFFECTS_INIT = "@ngrx/effects/init";
export declare class EffectsRootModule {
    private sources;
    constructor(sources: EffectSources, runner: EffectsRunner, store: Store<any>, rootEffects: any[], storeModule: StoreModule);
    addEffects(effectSourceInstance: any): void;
}
