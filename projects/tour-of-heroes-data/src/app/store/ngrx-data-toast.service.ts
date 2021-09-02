import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import {
  EntityAction,
  EntityCacheAction,
  ofEntityOp,
  OP_ERROR,
  OP_SUCCESS,
} from '@ngrx/data';
import { filter } from 'rxjs/operators';
import { ToastService } from '../core/toast.service';

/** Report ngrx-data success/error actions as toast messages * */
@Injectable({ providedIn: 'root' })
export class NgrxDataToastService {
  constructor(actions$: Actions, toast: ToastService) {
    actions$
      .pipe(
        ofEntityOp(),
        filter(
          (ea: EntityAction) =>
            ea.payload.entityOp.endsWith(OP_SUCCESS) ||
            ea.payload.entityOp.endsWith(OP_ERROR)
        )
      )
      // this service never dies so no need to unsubscribe
      .subscribe((action) =>
        toast.openSnackBar(
          `${action.payload.entityName} action`,
          action.payload.entityOp
        )
      );

    actions$
      .pipe(
        ofType(
          EntityCacheAction.SAVE_ENTITIES_SUCCESS,
          EntityCacheAction.SAVE_ENTITIES_ERROR
        )
      )
      .subscribe((action: any) =>
        toast.openSnackBar(
          `${action.type} - url: ${action.payload.url}`,
          'SaveEntities'
        )
      );
  }
}
