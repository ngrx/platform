import { EventEmitter } from '@angular/core';

export class MockEventEmitter<T> extends EventEmitter<T> {
  next(value: any) {}
  error(error: any) {}
  complete() {}
  emit() {}
}
