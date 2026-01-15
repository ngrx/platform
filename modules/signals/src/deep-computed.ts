import { computed } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';

/**
 * @description
 *
 * Creates a computed signal with deeply nested signals for each property when
 * the result is an object literal.
 *
 * @usageNotes
 *
 * ```ts
 * import { signal } from '@angular/core';
 * import { deepComputed } from '@ngrx/signals';
 *
 * const limit = signal(10);
 * const offset = signal(0);
 *
 * const pagination = deepComputed(() => ({
 *   currentPage: Math.floor(offset() / limit()) + 1,
 *   pageSize: limit(),
 * }));
 *
 * console.log(pagination()); // { currentPage: 1, pageSize: 10 }
 * console.log(pagination.currentPage()); // 1
 * console.log(pagination.pageSize()); // 10
 * ```
 */
export function deepComputed<T extends object>(
  computation: () => T
): DeepSignal<T> {
  return toDeepSignal(computed(computation));
}
