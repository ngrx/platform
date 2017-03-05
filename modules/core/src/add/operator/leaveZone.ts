import { Observable } from 'rxjs/Observable';

import { leaveZone, LeaveZoneSignature } from '../../operator/leaveZone';

Observable.prototype.leaveZone = leaveZone;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    leaveZone: LeaveZoneSignature<T>;
  }
}
