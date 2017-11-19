import { Subject } from 'rxjs/Subject';
import { ErrorReporter } from './error_reporter';
export declare class EffectSources extends Subject<any> {
    private errorReporter;
    constructor(errorReporter: ErrorReporter);
    addEffects(effectSourceInstance: any): void;
}
