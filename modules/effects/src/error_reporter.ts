import { Injectable, InjectionToken, Inject } from '@angular/core';
import { CONSOLE } from './tokens';

@Injectable()
export class ErrorReporter {
  constructor(@Inject(CONSOLE) private console: any) {}

  report(reason: string, details: any): void {
    this.console.group(reason);

    for (let key in details) {
      this.console.error(`${key}:`, details[key]);
    }

    this.console.groupEnd();
  }
}
