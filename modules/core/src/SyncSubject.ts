import { ReplaySubject } from 'rxjs/ReplaySubject';


export class SyncSubject<T> extends ReplaySubject<T> {

  constructor(value: T) {
    super(1);

    this.next(value);
  }
}
