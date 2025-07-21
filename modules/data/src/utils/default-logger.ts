import { Injectable } from '@angular/core';
import { Logger } from './interfaces';

/**
 * @public
 */
@Injectable()
export class DefaultLogger implements Logger {
  error(message?: any, extra?: any) {
    if (message) {
      if (extra) {
        console.error(message, extra);
      } else {
        console.error(message);
      }
    }
  }

  log(message?: any, extra?: any) {
    if (message) {
      if (extra) {
        console.log(message, extra);
      } else {
        console.log(message);
      }
    }
  }

  warn(message?: any, extra?: any) {
    if (message) {
      if (extra) {
        console.warn(message, extra);
      } else {
        console.warn(message);
      }
    }
  }
}
