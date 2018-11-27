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
 * private effectIdentifier: string;
 *
 * ngrxOnIdentifyEffects  () {
 *   return this.effectIdentifier;
 * }
 *
 * constructor(identifier: string) {
 *  this.effectIdentifier = identifier;
 * }
 * ```
 */
export interface OnIdentifyEffects {
  /**
   * @description
   * String identifier to differentiate effect instances.
   */
  ngrxOnIdentifyEffects: () => string;
}

export const onIdentifyEffectsKey: keyof OnIdentifyEffects =
  'ngrxOnIdentifyEffects';
