import { StoreModule } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
export declare class EffectsFeatureModule {
    private root;
    constructor(root: EffectsRootModule, effectSourceGroups: any[][], storeModule: StoreModule);
}
