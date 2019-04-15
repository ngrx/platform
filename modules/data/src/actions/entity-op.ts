// Ensure that these suffix values and the EntityOp suffixes match
// Cannot do that programmatically.

/** General purpose entity action operations, good for any entity type */
export enum EntityOp {
  // Persistance operations
  CANCEL_PERSIST = '@ngrx/data/cancel-persist',
  CANCELED_PERSIST = '@ngrx/data/canceled-persist',

  QUERY_ALL = '@ngrx/data/query-all',
  QUERY_ALL_SUCCESS = '@ngrx/data/query-all/success',
  QUERY_ALL_ERROR = '@ngrx/data/query-all/error',

  QUERY_LOAD = '@ngrx/data/query-load',
  QUERY_LOAD_SUCCESS = '@ngrx/data/query-load/success',
  QUERY_LOAD_ERROR = '@ngrx/data/query-load/error',

  QUERY_MANY = '@ngrx/data/query-many',
  QUERY_MANY_SUCCESS = '@ngrx/data/query-many/success',
  QUERY_MANY_ERROR = '@ngrx/data/query-many/error',

  QUERY_BY_KEY = '@ngrx/data/query-by-key',
  QUERY_BY_KEY_SUCCESS = '@ngrx/data/query-by-key/success',
  QUERY_BY_KEY_ERROR = '@ngrx/data/query-by-key/error',

  SAVE_ADD_MANY = '@ngrx/data/save/add-many',
  SAVE_ADD_MANY_ERROR = '@ngrx/data/save/add-many/error',
  SAVE_ADD_MANY_SUCCESS = '@ngrx/data/save/add-many/success',

  SAVE_ADD_ONE = '@ngrx/data/save/add-one',
  SAVE_ADD_ONE_ERROR = '@ngrx/data/save/add-one/error',
  SAVE_ADD_ONE_SUCCESS = '@ngrx/data/save/add-one/success',

  SAVE_DELETE_MANY = '@ngrx/data/save/delete-many',
  SAVE_DELETE_MANY_SUCCESS = '@ngrx/data/save/delete-many/success',
  SAVE_DELETE_MANY_ERROR = '@ngrx/data/save/delete-many/error',

  SAVE_DELETE_ONE = '@ngrx/data/save/delete-one',
  SAVE_DELETE_ONE_SUCCESS = '@ngrx/data/save/delete-one/success',
  SAVE_DELETE_ONE_ERROR = '@ngrx/data/save/delete-one/error',

  SAVE_UPDATE_MANY = '@ngrx/data/save/update-many',
  SAVE_UPDATE_MANY_SUCCESS = '@ngrx/data/save/update-many/success',
  SAVE_UPDATE_MANY_ERROR = '@ngrx/data/save/update-many/error',

  SAVE_UPDATE_ONE = '@ngrx/data/save/update-one',
  SAVE_UPDATE_ONE_SUCCESS = '@ngrx/data/save/update-one/success',
  SAVE_UPDATE_ONE_ERROR = '@ngrx/data/save/update-one/error',

  // Use only if the server supports upsert;
  SAVE_UPSERT_MANY = '@ngrx/data/save/upsert-many',
  SAVE_UPSERT_MANY_SUCCESS = '@ngrx/data/save/upsert-many/success',
  SAVE_UPSERT_MANY_ERROR = '@ngrx/data/save/upsert-many/error',

  // Use only if the server supports upsert;
  SAVE_UPSERT_ONE = '@ngrx/data/save/upsert-one',
  SAVE_UPSERT_ONE_SUCCESS = '@ngrx/data/save/upsert-one/success',
  SAVE_UPSERT_ONE_ERROR = '@ngrx/data/save/upsert-one/error',

  // Cache operations
  ADD_ALL = '@ngrx/data/add-all',
  ADD_MANY = '@ngrx/data/add-many',
  ADD_ONE = '@ngrx/data/add-one',
  REMOVE_ALL = '@ngrx/data/remove-all',
  REMOVE_MANY = '@ngrx/data/remove-many',
  REMOVE_ONE = '@ngrx/data/remove-one',
  UPDATE_MANY = '@ngrx/data/update-many',
  UPDATE_ONE = '@ngrx/data/update-one',
  UPSERT_MANY = '@ngrx/data/upsert-many',
  UPSERT_ONE = '@ngrx/data/upsert-one',

  COMMIT_ALL = '@ngrx/data/commit-all',
  COMMIT_MANY = '@ngrx/data/commit-many',
  COMMIT_ONE = '@ngrx/data/commit-one',
  UNDO_ALL = '@ngrx/data/undo-all',
  UNDO_MANY = '@ngrx/data/undo-many',
  UNDO_ONE = '@ngrx/data/undo-one',

  SET_CHANGE_STATE = '@ngrx/data/set-change-state',
  SET_COLLECTION = '@ngrx/data/set-collection',
  SET_FILTER = '@ngrx/data/set-filter',
  SET_LOADED = '@ngrx/data/set-loaded',
  SET_LOADING = '@ngrx/data/set-loading',
}

/** "Success" suffix appended to EntityOps that are successful.*/
export const OP_SUCCESS = '/success';

/** "Error" suffix appended to EntityOps that have failed.*/
export const OP_ERROR = '/error';

/** Make the error EntityOp corresponding to the given EntityOp */
export function makeErrorOp(op: EntityOp): EntityOp {
  return <EntityOp>(op + OP_ERROR);
}

/** Make the success EntityOp corresponding to the given EntityOp */
export function makeSuccessOp(op: EntityOp): EntityOp {
  return <EntityOp>(op + OP_SUCCESS);
}
