import { ChangeDetectorRef, Injector, NgZone, OnDestroy } from '@angular/core';
import {
  ArgumentNotObservableError,
  CdAware,
  getGlobalThis,
  potentialObservableValue,
  processCdAwareObservables,
  STATE_DEFAULT,
} from '../../src/core';
import {
  concat,
  EMPTY,
  NEVER,
  NextObserver,
  Observable,
  Observer,
  of,
  Subject,
} from 'rxjs';

class NoopNgZone {}

class MockChangeDetectorRef {}

let id = 0;

function MockRequestAnimationFrame(cb: Function) {
  cb && cb();
  return ++id;
}

class CdAwareImplementation extends CdAware implements OnDestroy {
  renderedValue: any = undefined;
  error: any = undefined;
  completed: boolean = false;

  public observablesSubject = new Subject<potentialObservableValue<any>>();
  protected observables$ = this.observablesSubject.pipe(
    processCdAwareObservables(
      this.getResetContextBehaviour(),
      this.getUpdateContextBehaviour(),
      this.getConfigurableBehaviour()
    )
  );

  constructor(cdRef: ChangeDetectorRef, ngZone: NgZone) {
    super(cdRef, ngZone);
    this.subscription = this.observables$.subscribe();
  }

  getResetContextObserver<T>(): NextObserver<T> {
    return {
      next: _ => (this.renderedValue = STATE_DEFAULT),
      error: e => (this.error = e),
      complete: () => (this.completed = true),
    };
  }

  getUpdateViewContextObserver<T>(): Observer<T> {
    return {
      next: n => (this.renderedValue = n),
      error: e => (this.error = e),
      complete: () => (this.completed = true),
    };
  }

  getConfigurableBehaviour<T>(): <T>(
    o$$: Observable<Observable<T>>
  ) => Observable<Observable<T>> {
    return o => o;
  }
}

let cdAwareImplementation: CdAwareImplementation;
beforeAll(() => {
  const injector = Injector.create([
    {
      provide: CdAwareImplementation,
      useClass: CdAwareImplementation,
      deps: [NgZone, ChangeDetectorRef],
    },
    { provide: NgZone, useClass: NoopNgZone, deps: [] },
    { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef, deps: [] },
  ]);
  cdAwareImplementation = injector.get(CdAwareImplementation);
});

describe('CdAware', () => {
  beforeEach(() => {
    getGlobalThis().requestAnimationFrame = undefined;
    getGlobalThis().__zone_symbol__requestAnimationFrame = MockRequestAnimationFrame;
    cdAwareImplementation.renderedValue = undefined;
    cdAwareImplementation.error = undefined;
    cdAwareImplementation.completed = false;
  });

  it('should be implementable', () => {
    expect(cdAwareImplementation).toBeDefined();
  });

  describe('next value', () => {
    it('should do nothing if initialized (as no value ever was emitted)', () => {
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.observablesSubject.next(undefined);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render null as value when initially null was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.observablesSubject.next(null);
      expect(cdAwareImplementation.renderedValue).toBe(null);
    });

    it('should render undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
      cdAwareImplementation.observablesSubject.next(of(undefined));
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render null as value when initially of(null) was passed (as null was emitted)', () => {
      cdAwareImplementation.observablesSubject.next(of(null));
      expect(cdAwareImplementation.renderedValue).toBe(null);
    });

    it('should render undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.observablesSubject.next(EMPTY);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.observablesSubject.next(NEVER);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });
    // Also: 'should keep last emitted value in the view until a new observable NEVER was passed (as no value ever was emitted from new observable)'
    it('should render emitted value from passed observable without changing it', () => {
      cdAwareImplementation.observablesSubject.next(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
    });

    it('should render undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
      cdAwareImplementation.observablesSubject.next(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      cdAwareImplementation.observablesSubject.next(NEVER);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });
  });

  describe('observable context', () => {
    it('next handling running observable', () => {
      cdAwareImplementation.observablesSubject.next(concat(of(42), NEVER));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(false);
    });

    it('next handling completed observable', () => {
      cdAwareImplementation.observablesSubject.next(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(true);
    });

    it('error handling', () => {
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      (cdAwareImplementation as any).observables$.subscribe({
        error: (e: Error) => expect(e).toBe(ArgumentNotObservableError),
      });
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      // @TODO use this line
      // expect(cdAwareImplementation.error).toBe(ArgumentNotObservableError);
      expect(cdAwareImplementation.completed).toBe(false);
    });

    it('completion handling', () => {
      cdAwareImplementation.observablesSubject.next(EMPTY);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(true);
    });
  });
});
