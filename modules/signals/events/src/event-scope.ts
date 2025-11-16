import { map, OperatorFunction } from 'rxjs';
import { EventInstance } from './event-instance';

/**
 * @experimental
 */
export type EventScope = 'self' | 'parent' | 'global';

/**
 * @experimental
 */
export type EventScopeConfig = { scope: EventScope };

/**
 * @experimental
 * @description
 *
 * Marks a single event to be dispatched in the specified scope.
 * Used in a tuple alongside an event to indicate its dispatch scope.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, type } from '@ngrx/signals';
 * import { event, Events, withEffects } from '@ngrx/signals/events';
 * import { mapResponse } from '@ngrx/operators';
 *
 * const opened = event('[Users Page] Opened');
 * const loadedSuccess = event('[Users API] Loaded Success', type<User[]>());
 * const loadedFailure = event('[Users API] Loaded Failure', type<string>());
 *
 * const UsersStore = signalStore(
 *   withEffects((
 *     _,
 *     events = inject(Events),
 *     usersService = inject(UsersService)
 *   ) => ({
 *     loadUsers$: events.on(opened).pipe(
 *       exhaustMap(() =>
 *         usersService.getAll().pipe(
 *           mapResponse({
 *             next: (users) => loadedSuccess(users),
 *             error: (error: { message: string }) => [
 *               loadedFailure(error.message),
 *               toScope('global'),
 *             ],
 *           }),
 *         ),
 *       ),
 *     ),
 *   })),
 * );
 * ```
 */
export function toScope(scope: EventScope): EventScopeConfig {
  return { scope };
}

/**
 * @experimental
 * @description
 *
 * RxJS operator that maps all emitted events in the stream to be dispatched
 * in the specified scope.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, type } from '@ngrx/signals';
 * import { event, Events, withEffects } from '@ngrx/signals/events';
 * import { mapResponse } from '@ngrx/operators';
 *
 * const opened = event('[Users Page] Opened');
 * const loadedSuccess = event('[Users API] Loaded Success', type<User[]>());
 * const loadedFailure = event('[Users API] Loaded Failure', type<string>());
 *
 * const UsersStore = signalStore(
 *   withEffects((
 *     _,
 *     events = inject(Events),
 *     usersService = inject(UsersService)
 *   ) => ({
 *     loadUsers$: events.on(opened).pipe(
 *       exhaustMap(() =>
 *         usersService.getAll().pipe(
 *           mapResponse({
 *             next: (users) => loadedSuccess(users),
 *             error: (error: { message: string }) =>
 *               loadedFailure(error.message),
 *           }),
 *           mapToScope('parent'),
 *         ),
 *       ),
 *     ),
 *   })),
 * );
 * ```
 */
export function mapToScope<T extends EventInstance<string, unknown>>(
  scope: EventScope
): OperatorFunction<T, [T, EventScopeConfig]> {
  return map((event) => [event, toScope(scope)]);
}
