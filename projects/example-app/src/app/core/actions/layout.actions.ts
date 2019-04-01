import { createAction, union } from '@ngrx/store';

export const openSidenav = createAction('[Layout] Open Sidenav');
export const closeSidenav = createAction('[Layout] Close Sidenav');

const all = union({ openSidenav, closeSidenav });
export type LayoutActionsUnion = typeof all;
