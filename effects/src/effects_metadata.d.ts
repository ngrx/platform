export interface EffectMetadata {
    propertyName: string;
    dispatch: boolean;
}
export declare function Effect({dispatch}?: {
    dispatch: boolean;
}): PropertyDecorator;
export declare function getSourceForInstance(instance: Object): any;
export declare const getSourceMetadata: (i: Object) => EffectMetadata[];
export declare type EffectsMetadata<T> = {
    [key in keyof T]?: undefined | {
        dispatch: boolean;
    };
};
export declare function getEffectsMetadata<T>(instance: T): EffectsMetadata<T>;
