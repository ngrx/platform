# Testing Effects

1. Import the `EffectsTestingModule` in your testing module:
  ```ts
  import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';

  describe('My Effect', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        AuthEffects
      ]
    }));
  });
  ```

2. Inject the `EffectsTestRunner`:
  ```ts
  let runner: EffectsRunner;
  let authEffects: AuthEffects;

  beforeEach(inject([
      EffectsRunner, AuthEffects
    ],
    (_runner, _authEffects) => {
      runner = _runner;
      authEffects = _authEffects;
    }
  ));
  ```

3. Queue up actions and then subscribe to the effect you want to test asserting
on the result:
  ```ts
  it('should return a LOGIN_SUCCESS action after logging in', () => {
    runner.queue({ type: 'LOGIN' });

    authEffects.login$.subscribe(result => {
      expect(result).toEqual({ type: 'LOGIN_SUCCESS' });
    });
  });
  ```
