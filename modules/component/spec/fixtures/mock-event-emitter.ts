export class MockEventEmitter<T> {
  next(value: any) {}
  error(error: any) {}
  complete() {}
  subscribe() {
    unsubscribe: () => {};
  }
  constructor(async: boolean) {}
}
