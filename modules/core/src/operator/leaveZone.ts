import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';

export function leaveZone<T>(zone: { runOutsideAngular: (fn: any) => any }): Observable<T> {
  return this.lift(new LeaveZoneOperator(zone));
}

export interface LeaveZoneSignature<T> {
  (zone: { runOutsideAngular: (fn: any) => any }): Observable<T>;
}

export class LeaveZoneOperator<T> implements Operator<T, T> {
  constructor(private _zone: { runOutsideAngular: (fn: any) => any }) { }

  call(subscriber: Subscriber<T>, source: any): any {
    return source._subscribe(new LeaveZoneSubscriber(subscriber, this._zone));
  }
}

class LeaveZoneSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>, private _zone: { runOutsideAngular: (fn: any) => any }) {
    super(destination);
  }

  protected _next(value: T) {
    this._zone.runOutsideAngular(() => this.destination.next(value));
  }
}
