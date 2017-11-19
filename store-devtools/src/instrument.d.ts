import { InjectionToken, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoreDevtools } from './devtools';
import { StoreDevtoolsConfig, StoreDevtoolsOptions } from './config';
import { ReduxDevtoolsExtension } from './extension';
export declare const IS_EXTENSION_OR_MONITOR_PRESENT: InjectionToken<boolean>;
export declare function createIsExtensionOrMonitorPresent(extension: ReduxDevtoolsExtension | null, config: StoreDevtoolsConfig): boolean;
export declare function createReduxDevtoolsExtension(): any;
export declare function createStateObservable(devtools: StoreDevtools): Observable<any>;
export declare function noMonitor(): null;
export declare function noActionSanitizer(): null;
export declare function noStateSanitizer(): null;
export declare const DEFAULT_NAME = "NgRx Store DevTools";
export declare function createConfig(_options: StoreDevtoolsOptions): StoreDevtoolsConfig;
export declare class StoreDevtoolsModule {
    static instrument(options?: StoreDevtoolsOptions): ModuleWithProviders;
}
