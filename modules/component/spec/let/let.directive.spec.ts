import {
  ChangeDetectorRef,
  Component,
  NgZone as OriginalNgZone,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { CoalescingConfig } from '../../src/core';
import { EMPTY, NEVER, Observable, of, throwError } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';
import { LetDirective } from '../../src/let';

let letDirective: any;

let id = 0;

function MockRequestAnimationFrame(cb: Function) {
  cb && cb();
  return ++id;
}

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
  cfg: CoalescingConfig = { optimized: false };
  value$: Observable<number> = of(42);
}

@Component({
  template: `
    <ng-container *ngrxLet="value$; $error as error">{{
      error.message
    }}</ng-container>
  `,
})
class LetDirectiveTestErrorComponent {
  cfg: CoalescingConfig = { optimized: false };
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
  cfg: CoalescingConfig = { optimized: false };
  value$: Observable<number> = of(42);
}

let fixtureLetDirectiveTestComponent: any;
let letDirectiveTestComponent: {
  cfg: CoalescingConfig;
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

describe('LetDirective', () => {
  describe('when nexting values', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LetDirectiveTestComponent, LetDirective],
        providers: [
          { provide: NgZone, useClass: NgZone },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
          { provide: TemplateRef, useClass: TemplateRef },
          { provide: ViewContainerRef, useClass: ViewContainerRef },
        ],
      });

      fixtureLetDirectiveTestComponent = TestBed.createComponent(
        LetDirectiveTestComponent
      );
      letDirectiveTestComponent =
        fixtureLetDirectiveTestComponent.componentInstance;
      componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
    }));

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

    it('should render undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = NEVER;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
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
  });

  xdescribe('when error', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LetDirectiveTestErrorComponent, LetDirective],
        providers: [
          { provide: NgZone, useClass: NgZone },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
          { provide: TemplateRef, useClass: TemplateRef },
          { provide: ViewContainerRef, useClass: ViewContainerRef },
        ],
      });

      fixtureLetDirectiveTestComponent = TestBed.createComponent(
        LetDirectiveTestErrorComponent
      );
      letDirectiveTestComponent =
        fixtureLetDirectiveTestComponent.componentInstance;
      componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
    }));

    it('should render the error if one occurs', () => {
      letDirectiveTestComponent.value$ = throwError(new Error('error message'));
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('error message');
    });
  });

  describe('when complete', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LetDirectiveTestCompleteComponent, LetDirective],
        providers: [
          { provide: NgZone, useClass: NgZone },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
          { provide: TemplateRef, useClass: TemplateRef },
          { provide: ViewContainerRef, useClass: ViewContainerRef },
        ],
      });

      fixtureLetDirectiveTestComponent = TestBed.createComponent(
        LetDirectiveTestCompleteComponent
      );
      letDirectiveTestComponent =
        fixtureLetDirectiveTestComponent.componentInstance;
      componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
    }));

    it('should render true if completed', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    });
  });
});