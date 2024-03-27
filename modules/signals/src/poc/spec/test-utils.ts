export type Assert<Condition extends true> = Condition;
export type AreEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
export type Extends<A, B> = A extends B ? true : false;
export type Not<Value extends boolean> = Value extends true ? false : true;
