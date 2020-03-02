let _ngrxMockEnvironment = false;
export function setNgrxMockEnvironment(value: boolean): void {
  _ngrxMockEnvironment = value;
}
export function isNgrxMockEnvironment(): boolean {
  return _ngrxMockEnvironment;
}
