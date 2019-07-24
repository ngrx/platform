import { ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

export function HostListener$<T>(eventName: string): PropertyDecorator {
  return (
    // tslint:disable-next-line
    target: Object,
    propertyKey: string | symbol
  ) => {
    Object.defineProperty(target, propertyKey, {
      get() {
        // @TODO investigate @ViewChild for usage
        const elementRef = this.injector.get(ElementRef);
        return fromEvent(elementRef.nativeElement, eventName);
      },
    });
  };
}
