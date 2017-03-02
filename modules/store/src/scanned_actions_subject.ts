import { Injectable, Provider, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Action } from './models';


@Injectable()
export class ScannedActionsSubject extends Subject<Action> implements OnDestroy {
  ngOnDestroy() {
    this.complete();
  }
}

export const SCANNED_ACTIONS_SUBJECT_PROVIDERS: Provider[] = [
  ScannedActionsSubject,
];
