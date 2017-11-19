import { EntityState } from './models';
export declare function createStateOperator<V, R>(mutator: (arg: R, state: EntityState<V>) => boolean): EntityState<V>;
