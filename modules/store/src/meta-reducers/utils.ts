export const RUNTIME_CHECK_URL =
  'https://ngrx.io/guide/store/configuration/runtime-checks';

export function isUndefined(target: any): target is undefined {
  return target === undefined;
}

export function isNull(target: any): target is null {
  return target === null;
}

export function isArray(target: any): target is Array<any> {
  return Array.isArray(target);
}

export function isString(target: any): target is string {
  return typeof target === 'string';
}

export function isBoolean(target: any): target is boolean {
  return typeof target === 'boolean';
}

export function isNumber(target: any): target is number {
  return typeof target === 'number';
}

export function isObjectLike(target: any): target is object {
  return typeof target === 'object' && target !== null;
}

export function isObject(target: any): target is object {
  return isObjectLike(target) && !isArray(target);
}

export function isPlainObject(target: any): target is object {
  if (!isObject(target)) {
    return false;
  }

  const targetPrototype = Object.getPrototypeOf(target);
  return targetPrototype === Object.prototype || targetPrototype === null;
}

export function isFunction(target: any): target is () => void {
  return typeof target === 'function';
}

export function isComponent(target: any) {
  return isFunction(target) && target.hasOwnProperty('ɵcmp');
}

export function hasOwnProperty(target: object, propertyName: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, propertyName);
}
