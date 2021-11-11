import { EventEmitter } from '@angular/core';

export class MockEventEmitter<T> extends EventEmitter<T> {
  override next(value: any) {}
  override error(error: any) {}
  override complete() {}
  override emit() {}
}
