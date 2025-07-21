let _ngrxMockEnvironment = false;
/**
 * @public
 */
export function setNgrxMockEnvironment(value: boolean): void {
  _ngrxMockEnvironment = value;
}
/**
 * @public
 */
export function isNgrxMockEnvironment(): boolean {
  return _ngrxMockEnvironment;
}
