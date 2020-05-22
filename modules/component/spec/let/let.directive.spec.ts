import {
  ChangeDetectorRef,
  Component,
  NgZone as OriginalNgZone,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { EMPTY, interval, NEVER, Observable, of, throwError } from 'rxjs';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LetDirective } from '@ngrx/component';
import { take } from 'rxjs/operators';

let letDirective: any;

class NgZone extends OriginalNgZone {
  constructor() {
    super({ enableLongStackTrace: false });
  }
}

class NoopNgZone {
  constructor() {
    // super({enableLongStackTrace: false});
  }
}

class MockChangeDetectorRef {
  public markForCheck(): string {
    return 'markForCheck';
  }

  public detectChanges(): string {
    return 'detectChanges';
  }
}

@Component({
  template: `
    <ng-container
      *ngrxLet="value$ as value; $error as error; $complete as complete"
      >{{ (value | json) || 'undefined' }}</ng-container
    >
  `,
})
class LetDirectiveTestComponent {
  cfg: any = { optimized: false };
  value$: Observable<number> = of(42);
}

@Component({
  template: `
    <ng-container *ngrxLet="value$; $error as error">{{ error }}</ng-container>
  `,
})
class LetDirectiveTestErrorComponent {
  cfg: any = { optimized: false };
  value$: Observable<number> = of(42);
}

@Component({
  template: `
    <ng-container *ngrxLet="value$; $complete as complete">{{
      complete
    }}</ng-container>
  `,
})
class LetDirectiveTestCompleteComponent {
  cfg: any = { optimized: false };
  value$: Observable<number> = of(42);
}

let fixtureLetDirectiveTestComponent: any;
let letDirectiveTestComponent: {
  cfg: any;
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

const setupLetDirectiveTestComponent = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestComponent, LetDirective],
    providers: [
      NgZone,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      TemplateRef,
      ViewContainerRef,
    ],
  });
  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};
const setupLetDirectiveTestComponentError = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestErrorComponent, LetDirective],
    providers: [
      NgZone,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      TemplateRef,
      ViewContainerRef,
    ],
  });

  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestErrorComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};
const setupLetDirectiveTestComponentComplete = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestCompleteComponent, LetDirective],
    providers: [
      NgZone,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      TemplateRef,
      ViewContainerRef,
    ],
  });

  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestCompleteComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};

describe('LetDirective', () => {
  describe('when nexting values', () => {
    beforeEach(async(setupLetDirectiveTestComponent));

    it('should be instantiable', () => {
      expect(fixtureLetDirectiveTestComponent).toBeDefined();
      expect(letDirectiveTestComponent).toBeDefined();
      expect(componentNativeElement).toBeDefined();
    });

    it('should render undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = undefined;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render null as value when initially null was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = null;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('null');
    });

    it('should render undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
      letDirectiveTestComponent.value$ = of(undefined);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render null as value when initially of(null) was passed (as null was emitted)', () => {
      letDirectiveTestComponent.value$ = of(null);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('null');
    });

    it('should render undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render nothing as value when initially NEVER was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = NEVER;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('');
    });

    it('should render emitted value from passed observable without changing it', () => {
      letDirectiveTestComponent.value$ = of(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
    });

    it('should render undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
      letDirectiveTestComponent.value$ = of(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
      letDirectiveTestComponent.value$ = NEVER;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render new value as value when a new observable was passed', () => {
      letDirectiveTestComponent.value$ = of(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
      letDirectiveTestComponent.value$ = of(45);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('45');
    });

    it('should render the last value when a new observable was passed', () => {
      letDirectiveTestComponent.value$ = of(42, 45);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('45');
    });

    it(
      'should render values over time when a new observable was passed',
      fakeAsync(() => {
        letDirectiveTestComponent.value$ = interval(1000).pipe(take(3));
        fixtureLetDirectiveTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('');
        tick(1000);
        fixtureLetDirectiveTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('0');
        tick(1000);
        fixtureLetDirectiveTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('1');
        tick(1000);
        fixtureLetDirectiveTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('2');

        tick(1000);
        fixtureLetDirectiveTestComponent.detectChanges();
        // Remains at 2, since that was the last value.
        expect(componentNativeElement.textContent).toBe('2');
      })
    );
  });

  describe('when error', () => {
    beforeEach(async(setupLetDirectiveTestComponentError));

    it('should render the error to false if next or complete', () => {
      letDirectiveTestComponent.value$ = of(1);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('false');
    });

    it('should render the error to true if one occurs', () => {
      letDirectiveTestComponent.value$ = throwError(new Error('error message'));
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    });
  });

  describe('when complete', () => {
    beforeEach(async(setupLetDirectiveTestComponentComplete));

    it('should render true if completed', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    });
  });
});
