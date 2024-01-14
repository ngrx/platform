/**
 * `withEncapsulation` has its limitations. We cannot forbid `patchState` to update
 * the store and users have to use it always.
 *
 * It is good that it stands on top and does not depend on any position in the state.
 * By that, we can add further features but only those properties which are defined
 * at the top are exposed.
 *
 * If no state property is exposed, `patchUpdate` cannot be applied to the state.
 */
