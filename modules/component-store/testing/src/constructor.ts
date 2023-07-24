/** A constructor type */
export interface Constructor<ClassType> {
  new (...args: never[]): ClassType;
}
