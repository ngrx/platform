import { Observable } from 'rxjs/Observable';
import { EffectNotification } from './effect_notification';
export interface OnRunEffects {
    ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification>;
}
export declare function isOnRunEffects(sourceInstance: Object): sourceInstance is OnRunEffects;
