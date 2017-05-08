import { of } from 'rxjs/observable/of';
import { Effect } from '../src/effects';
import { SingletonEffectsService } from '../src/singleton-effects.service';

describe('SingletonEffectsService', () => {
  it('should filter out duplicate effect instances and register new ones', () => {
    class Source1 {
      @Effect() a$ = of('a');
      @Effect() b$ = of('b');
      @Effect() c$ = of('c');
    }
    class Source2 {
      @Effect() d$ = of('d');
      @Effect() e$ = of('e');
      @Effect() f$ = of('f');
    }
    const instance1 = new Source1();
    const instance2 = new Source2();
    let singletonEffectsService = new SingletonEffectsService();

    let result = singletonEffectsService.removeExistingAndRegisterNew([ instance1 ]);
    expect(result).toContain(instance1);

    result = singletonEffectsService.removeExistingAndRegisterNew([ instance1, instance2 ]);
    expect(result).not.toContain(instance1);
    expect(result).toContain(instance2);

    result = singletonEffectsService.removeExistingAndRegisterNew([ instance1, instance2 ]);
    expect(result).not.toContain(instance1);
    expect(result).not.toContain(instance2);
  });
});
