import { OnDestroy } from '@angular/core';
import {
  concat,
  EMPTY,
  NEVER,
  NextObserver,
  Observer,
  of,
  throwError,
  Unsubscribable,
} from 'rxjs';

import {
  CdAware,
  createCdAware,
} from '../../../src/core/cd-aware/cd-aware_creator';
import { createRender } from '../../../src/core/cd-aware/creator_render';
import {
  manualInstanceNgZone,
  MockChangeDetectorRef,
} from '../../fixtures/fixtures';

class CdAwareImplementation<U> implements OnDestroy {
  public renderedValue: any = undefined;
  public error: any = undefined;
  public completed = false;
  private readonly subscription: Unsubscribable;
  public cdAware: CdAware<U | undefined | null>;
  resetContextObserver: NextObserver<any> = {
    next: (_) => (this.renderedValue = undefined),
  };
  updateViewContextObserver: Observer<U | undefined | null> = {
    next: (n: U | undefined | null) => (this.renderedValue = n),
    error: (e) => (this.error = e),
    complete: () => (this.completed = true),
  };

  constructor() {
    this.cdAware = createCdAware<U>({
      render: createRender({
        ngZone: manualInstanceNgZone,
        cdRef: new MockChangeDetectorRef(),
      }),
      updateViewContextObserver: this.updateViewContextObserver,
      resetContextObserver: this.resetContextObserver,
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

    it('should render_creator undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(undefined);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render_creator null as value when initially null was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(null);
      expect(cdAwareImplementation.renderedValue).toBe(null);
    });

    it('should render_creator undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(of(undefined));
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render_creator null as value when initially of(null) was passed (as null was emitted)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(of(null));
      expect(cdAwareImplementation.renderedValue).toBe(null);
    });

    it('should render_creator undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(EMPTY);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });

    it('should render_creator undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(NEVER);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });
    // Also: 'should keep last emitted value in the view until a new observable NEVER was passed (as no value ever was emitted from new observable)'
    it('should render_creator emitted value from passed observable without changing it', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
    });

    it('should render_creator emitted value from passed promise without changing it', (done: any) => {
      cdAwareImplementation.cdAware.nextPotentialObservable(
        Promise.resolve(42)
      );
      setTimeout(() => {
        expect(cdAwareImplementation.renderedValue).toBe(42);
        done();
      });
    });

    it('should render_creator undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      cdAwareImplementation.cdAware.nextPotentialObservable(NEVER);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
    });
  });

  describe('observable context', () => {
    it('next handling running observable', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(
        concat(of(42), NEVER)
      );
      expect(cdAwareImplementation.renderedValue).toBe(42);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(false);
    });

    it('next handling completed observable', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(of(42));
      expect(cdAwareImplementation.renderedValue).toBe(42);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(true);
    });

    it('error handling', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(
        throwError('Error!')
      );
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      expect(cdAwareImplementation.error).toBe('Error!');
      expect(cdAwareImplementation.completed).toBe(false);
    });

    it('completion handling', () => {
      cdAwareImplementation.cdAware.nextPotentialObservable(EMPTY);
      expect(cdAwareImplementation.renderedValue).toBe(undefined);
      expect(cdAwareImplementation.error).toBe(undefined);
      expect(cdAwareImplementation.completed).toBe(true);
    });
  });
});
