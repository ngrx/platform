import { Observable } from 'rxjs/Observable';
import { select, SelectSignature } from '../../operator/select';

Observable.prototype.select = select;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    select: SelectSignature<T>;
  }
}