import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { EffectSources } from './effect_sources';
import { tap } from 'rxjs/operators';
import { throwErrorOnInvalidAction } from '../../../modules/store/src/actions_subject';

@Injectable()
export class EffectsRunner implements OnDestroy {
  private effectsSubscription: Subscription | null = null;

  constructor(
    private effectSources: EffectSources,
    private store: Store<any>
  ) {}

  start() {
    if (!this.effectsSubscription) {
      this.effectsSubscription = this.effectSources
        .toActions()
        .pipe(tap(action => throwErrorOnInvalidAction(action)))
        .subscribe(this.store);
    }
  }

  ngOnDestroy() {
    if (this.effectsSubscription) {
      this.effectsSubscription.unsubscribe();
      this.effectsSubscription = null;
    }
  }
}
