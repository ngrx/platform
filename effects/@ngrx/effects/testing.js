import { Actions } from '@ngrx/effects';
import { defer as defer$1 } from 'rxjs/observable/defer';

function provideMockActions(factoryOrSource) {
    return {
        provide: Actions,
        useFactory: () => {
            if (typeof factoryOrSource === 'function') {
                return new Actions(defer$1(factoryOrSource));
            }
            return new Actions(factoryOrSource);
        },
    };
}

export { provideMockActions };
//# sourceMappingURL=testing.js.map
