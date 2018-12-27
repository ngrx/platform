import { Observable } from 'rxjs';
import { EffectNotification } from '.';
import { Action } from '@ngrx/store';

/**
 * @description
 * Interface to set an identifier for effect instances.
 *
 * By default, each Effects class is registered
 * once regardless of how many times the Effect class
 * is loaded. By implementing this interface, you define
 * a unique identifier to register an Effects class instance
 * multiple times.
 *
 * @usageNotes
 *
 * ### Set an identifier for an Effects class
 *
 * ```ts
 * class EffectWithIdentifier implements OnIdentifyEffects {
 *  constructor(private effectIdentifier: string) {}
 *
 *  ngrxOnIdentifyEffects() {
 *    return this.effectIdentifier;
 *  }
 *
 * ```
 */
export interface OnIdentifyEffects {
  /**
   * @description
   * String identifier to differentiate effect instances.
   */
  ngrxOnIdentifyEffects(): string;
}

export const onIdentifyEffectsKey: keyof OnIdentifyEffects =
  'ngrxOnIdentifyEffects';

export type onRunEffectsFn = (
  resolvedEffects$: Observable<EffectNotification>
) => Observable<EffectNotification>;

/**
 * @description
 * Interface to control the lifecycle of effects.
 *
 * By default, effects are merged and subscribed to the store. Implement the OnRunEffects interface to control the lifecycle of the resolved effects.
 *
 * @usageNotes
 *
 * ### Implement the OnRunEffects interface on an Effects class
 *
 * ```ts
 * export class UserEffects implements OnRunEffects {
 *   constructor(private actions$: Actions) {}
 *
 *   ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
 *     return this.actions$.pipe(
 *       ofType('LOGGED_IN'),
 *       exhaustMap(() =>
 *         resolvedEffects$.pipe(
 *           takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
 *         )
 *       )
 *     );
 *   }
 * }
 * ```
 */
export interface OnRunEffects {
  /**
   * @description
   * Method to control the lifecycle of effects.
   */
  ngrxOnRunEffects: onRunEffectsFn;
}

export const onRunEffectsKey: keyof OnRunEffects = 'ngrxOnRunEffects';

/**
 * @description
 * Interface to dispatch an action after effect registration.
 *
 * Implement this interface to dispatch a custom action after
 * the effect has been added. You can listen to this action
 * in the rest of the application to execute something after
 * the effect is registered.
 *
 * @usageNotes
 *
 * ### Set an identifier for an Effects class
 *
 * ```ts
 * class EffectWithInitAction implements OnInitEffects {
 *  ngrxOnInitEffects() {
 *    return { type: '[EffectWithInitAction] Init' };
 *  }
 * ```
 */
export interface OnInitEffects {
  /**
   * @description
   * Action to be dispatched after the effect is registered.
   */
  ngrxOnInitEffects(): Action;
}

export const onInitEffects: keyof OnInitEffects = 'ngrxOnInitEffects';
