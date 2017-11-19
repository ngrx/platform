import { Actions } from '@ngrx/effects';
import { defer } from 'rxjs/observable/defer';
export function provideMockActions(factoryOrSource) {
    return {
        provide: Actions,
        useFactory: () => {
            if (typeof factoryOrSource === 'function') {
                return new Actions(defer(factoryOrSource));
            }
            return new Actions(factoryOrSource);
        },
    };
}
//# sourceMappingURL=testing.js.map