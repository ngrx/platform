import { Type, ɵstringify as stringify } from '@angular/core';

export function invalidInputValueError(type: Type<any>, value: Object) {
  return Error(
    `invalidInputValueError: '${value}' for directive '${stringify(type)}'`
  );
}
