import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';

export interface EnterZoneSignature<T> {
  (zone: { run: (fn: any) => any }): Observable<T>;
}

export function enterZone<T>(zone: { run: (fn: any) => any }): Observable<T> {
  return this.lift(new EnterZoneOperator(zone));
}

export class EnterZoneOperator<T> implements Operator<T, T> {
  constructor(private _zone: { run: (fn: any) => any }) { }

  call(subscriber: Subscriber<T>, source: any): any {
    return source._subscribe(new EnterZoneSubscriber(subscriber, this._zone));
  }
}

class EnterZoneSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>, private _zone: { run: (fn: any) => any }) {
    super(destination);
  }

  protected _next(value: T) {
    this._zone.run(() => this.destination.next(value));
  }
}
