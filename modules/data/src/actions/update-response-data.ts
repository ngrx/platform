/**
 * Data returned in an EntityAction from the EntityEffects for SAVE_UPDATE_ONE_SUCCESS.
 * Effectively extends Update<T> with a 'changed' flag.
 * The is true if the server sent back changes to the entity data after update.
 * Such changes must be in the entity data in changes property.
 * Default is false (server did not return entity data; assume it changed nothing).
 * See EntityEffects.
 */
export interface UpdateResponseData<T> {
  /** Original key (id) of the entity */
  id: number | string;
  /** Entity update data. Should include the key (original or changed) */
  changes: Partial<T>;
  /**
   * Whether the server made additional changes after processing the update.
   * Such additional changes should be in the 'changes' object.
   * Default is false
   */
  changed?: boolean;
}
