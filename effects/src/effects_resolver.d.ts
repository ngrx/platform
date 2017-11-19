import { Observable } from 'rxjs/Observable';
import { EffectNotification } from './effect_notification';
export declare function mergeEffects(sourceInstance: any): Observable<EffectNotification>;
export declare function resolveEffectSource(sourceInstance: any): Observable<EffectNotification>;
