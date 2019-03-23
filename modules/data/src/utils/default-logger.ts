import { Injectable } from '@angular/core';
import { Logger } from './interfaces';

@Injectable()
export class DefaultLogger implements Logger {
  error(message?: any, extra?: any) {
    if (message) {
      extra ? console.error(message, extra) : console.error(message);
    }
  }

  log(message?: any, extra?: any) {
    if (message) {
      extra ? console.log(message, extra) : console.log(message);
    }
  }

  warn(message?: any, extra?: any) {
    if (message) {
      extra ? console.warn(message, extra) : console.warn(message);
    }
  }
}
