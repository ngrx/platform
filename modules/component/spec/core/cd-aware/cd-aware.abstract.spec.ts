import { OnDestroy } from '@angular/core';
import { CdAware, createCdAware } from '../../../src/core';
import {
  concat,
  EMPTY,
  NEVER,
  NextObserver,
  Observable,
  of,
  PartialObserver,
  Unsubscribable,
} from 'rxjs';
import { tap } from 'rxjs/operators';

class CdAwareImplementation<U> implements OnDestroy {
  public renderedValue: any = undefined;
  public error: any = undefined;
  public completed: boolean = false;
  private readonly subscription: Unsubscribable;
  public cdAware: CdAware<U | undefined | null>;
  resetContextObserver: NextObserver<any> = {
    next: _ => (this.renderedValue = undefined),
    error: e => (this.error = e),
    complete: () => (this.completed = true),
  };
  updateViewContextObserver: PartialObserver<U | undefined | null> = {
    next: (n: U | undefined | null) => (this.renderedValue = n),
    error: e => (this.error = e),
    complete: () => (this.completed = true),
  };
  configurableBehaviour = <T>(
    o$: Observable<Observable<T>>
  ): Observable<Observable<T>> => o$.pipe(tap());

  constructor() {
    this.cdAware = createCdAware<U>({
      work: () => {},
      resetContextObserver: this.resetContextObserver,
      updateViewContextObserver: this.updateViewContextObserver,
      configurableBehaviour: this.configurableBehaviour,
    });
    this.subscription = this.cdAware.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

let cdAwareImplementation: CdAwareImplementation<any>;
const setupCdAwareImplementation = () => {
  cdAwareImplementation = new CdAwareImplementation();
  cdAwareImplementation.renderedValue = undefined;
  cdAwareImplementation.error = undefined;
  cdAwareImplementation.completed = false;
};

describe('CdAware', () => {
  beforeEach(() => {
    setupCdAwareImplementation();
  });

  it('should be implementable', () => {
    expect(cdAwareImplementation).toBeDefined();
  });

  describe('next value', () => {
    it('should do nothing if initialized (as no value ever was emitted)', () => {
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.next(undefined);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render null as value when initially null was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.next(null);
      expect(cdAwareImplementation.renderedValue).toBe(null);
    });

    it('should render undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
      cdAwareImplementation.cdAware.next(of(undefined));
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render null as value when initially of(null) was passed (as null was emitted)', () => {
      cdAwareImplementation.cdAware.next(of(null));
      expect(cdAwareImplementation.renderedValue).toBe(null);
    });

    it('should render undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.next(EMPTY);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.next(NEVER);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });
    // Also: 'should keep last emitted value in the view until a new observable NEVER was passed (as no value ever was emitted from new observable)'
    it('should render emitted value from passed observable without changing it', () => {
      cdAwareImplementation.cdAware.next(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
    });

    it('should render undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
      cdAwareImplementation.cdAware.next(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      cdAwareImplementation.cdAware.next(NEVER);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });
  });

  describe('observable context', () => {
    it('next handling running observable', () => {
      cdAwareImplementation.cdAware.next(concat(of(42), NEVER));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(false);
    });

    it('next handling completed observable', () => {
      cdAwareImplementation.cdAware.next(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(true);
    });

    it('error handling', () => {
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      cdAwareImplementation.cdAware.subscribe({
        error: (e: Error) => expect(e).toBeDefined(),
      });
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      // @TODO use this line
      // expect(cdAwareImplementation.error).toBe(ArgumentNotObservableError);
      expect(cdAwareImplementation.completed).toBe(false);
    });

    it('completion handling', () => {
      cdAwareImplementation.cdAware.next(EMPTY);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(true);
    });
  });
});
