import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Injectable()
export class EffectsRunner extends ReplaySubject<any> {
  constructor() {
    super();
  }

  queue(action: any) {
    this.next(action);
  }
}
