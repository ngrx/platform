import { Observable } from 'rxjs';
import {
  getPropertySubject,
  getReplaySubjectFactory,
} from '../core/get-property-subject';

export function Input$<T>(): PropertyDecorator {
  return (
    // @TODO get better typing
    // tslint:disable-next-line
    component: Object,
    propertyKey: PropertyKey
  ) => {
    const keyUniquePerPrototype = Symbol('@ngrx-Input$');

    const propertyKeyDescriptor: TypedPropertyDescriptor<Observable<T>> = {
      set(newValue) {
        // @TODO: Get type of property instead of any
        getPropertySubject<any>(
          this,
          keyUniquePerPrototype,
          getReplaySubjectFactory(1)
        ).next(newValue);
      },
      get() {
        return getPropertySubject<any>(
          this,
          keyUniquePerPrototype,
          getReplaySubjectFactory(1)
        );
      },
    };

    Object.defineProperty(component, propertyKey, propertyKeyDescriptor);
  };
}
