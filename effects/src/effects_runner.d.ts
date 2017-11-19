import { OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { EffectSources } from './effect_sources';
export declare class EffectsRunner implements OnDestroy {
    private effectSources;
    private store;
    private effectsSubscription;
    constructor(effectSources: EffectSources, store: Store<any>);
    start(): void;
    ngOnDestroy(): void;
}
