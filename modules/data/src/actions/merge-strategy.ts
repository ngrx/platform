/** How to merge an entity, after query or save, when the corresponding entity in the collection has unsaved changes. */
export enum MergeStrategy {
  /**
   * Update the collection entities and ignore all change tracking for this operation.
   * Each entity's `changeState` is untouched.
   */
  IgnoreChanges,
  /**
   * Updates current values for unchanged entities.
   * For each changed entity it preserves the current value and overwrites the `originalValue` with the merge entity.
   * This is the query-success default.
   */
  PreserveChanges,
  /**
   * Replace the current collection entities.
   * For each merged entity it discards the `changeState` and sets the `changeType` to "unchanged".
   * This is the save-success default.
   */
  OverwriteChanges,
}
