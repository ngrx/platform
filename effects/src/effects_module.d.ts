import { ModuleWithProviders, Type } from '@angular/core';
export declare class EffectsModule {
    static forFeature(featureEffects: Type<any>[]): ModuleWithProviders;
    static forRoot(rootEffects: Type<any>[]): ModuleWithProviders;
}
export declare function createSourceInstances(...instances: any[]): any[];
export declare function getConsole(): Console;
