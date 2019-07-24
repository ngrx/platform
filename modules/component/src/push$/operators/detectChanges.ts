import { ChangeDetectorRef } from '@angular/core';
import { pipe, UnaryFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function detectChanges(
  cdr: ChangeDetectorRef
): UnaryFunction<Observable<unknown>, Observable<unknown>> {
  return pipe(tap(_ => cdr.detectChanges()));
}
