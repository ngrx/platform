import {
  ChangeDetectorRef,
  Component,
  Directive,
  ErrorHandler,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  BehaviorSubject,
  delay,
  EMPTY,
  interval,
  NEVER,
  Observable,
  ObservableInput,
  of,
  switchMap,
  take,
  throwError,
  timer,
} from 'rxjs';
import { LetDirective } from '../../src/let/let.directive';
import { MockChangeDetectorRef, MockErrorHandler } from '../fixtures/fixtures';

@Component({
  template: `
    <ng-container
      *ngrxLet="value$ as value; $error as error; $complete as complete"
      >{{
        value === null ? 'null' : (value | json) || 'undefined'
      }}</ng-container
    >
  `,
})
class LetDirectiveTestComponent {
  value$!: Observable<number>;
}

@Component({
  template: `
    <ng-container *ngrxLet="value$; $error as error">{{
      error === undefined ? 'undefined' : error
    }}</ng-container>
  `,
})
class LetDirectiveTestErrorComponent {
  value$ = of(42);
}

@Component({
  template: `
    <ng-container *ngrxLet="value$; $complete as complete">{{
      complete
    }}</ng-container>
  `,
})
class LetDirectiveTestCompleteComponent {
  value$ = of(42);
}

@Component({
  template: `
    <ng-container *ngrxLet="value$ as value; $suspense as s">{{
      s ? 'suspense' : value
    }}</ng-container>
  `,
})
class LetDirectiveTestSuspenseComponent {
  value$ = of(42);
}

@Component({
  template: `
    <ng-container *ngrxLet="value$ as value; suspenseTpl: loading">{{
      value === undefined ? 'undefined' : value
    }}</ng-container>
    <ng-template #loading>Loading...</ng-template>
  `,
})
class LetDirectiveTestSuspenseTplComponent {
  value$ = of(42);
}

@Directive({
  selector: '[recursiveDirective]',
})
export class RecursiveDirective {
  constructor(private subject: BehaviorSubject<number>) {
    this.subject.next(1);
  }
}

@Component({
  template: `
    <ng-container recursiveDirective *ngrxLet="subject as value">{{
      value
    }}</ng-container>
  `,
})
class LetDirectiveTestRecursionComponent {
  constructor(public subject: BehaviorSubject<number>) {}

  get value$() {
    return this.subject;
  }
}

let fixtureLetDirectiveTestComponent: ComponentFixture<LetDirectiveTestComponent>;
let letDirectiveTestComponent: {
  value$: ObservableInput<any> | undefined | null;
};
let componentNativeElement: any;

const setupLetDirectiveTestComponent = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestComponent, LetDirective],
    providers: [
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
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      { provide: ErrorHandler, useClass: MockErrorHandler },
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

const setupLetDirectiveTestComponentSuspense = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestSuspenseComponent, LetDirective],
    providers: [
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      { provide: ErrorHandler, useClass: MockErrorHandler },
      TemplateRef,
      ViewContainerRef,
    ],
  });

  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestSuspenseComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};

const setupLetDirectiveTestComponentSuspenseTpl = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestSuspenseTplComponent, LetDirective],
    providers: [
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      { provide: ErrorHandler, useClass: MockErrorHandler },
      TemplateRef,
      ViewContainerRef,
    ],
  });

  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestSuspenseTplComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};

const setupLetDirectiveTestRecursionComponent = (): void => {
  const subject = new BehaviorSubject(0);
  TestBed.configureTestingModule({
    declarations: [
      LetDirectiveTestRecursionComponent,
      RecursiveDirective,
      LetDirective,
    ],
    providers: [
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      TemplateRef,
      ViewContainerRef,
      { provide: BehaviorSubject, useValue: subject },
    ],
  });
  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestRecursionComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};

describe('LetDirective', () => {
  describe('when nexting values', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponent));

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

    it('should render emitted value from passed promise without changing it', fakeAsync(() => {
      letDirectiveTestComponent.value$ = Promise.resolve(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      flushMicrotasks();
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
    }));

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

    it('should render values over time when a new observable was passed', fakeAsync(() => {
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
    }));

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

    it('should render values over time when a new observable was passed', fakeAsync(() => {
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
    }));
  });

  describe('when error', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponentError));

    it('should render undefined when next event is emitted', () => {
      letDirectiveTestComponent.value$ = new BehaviorSubject(1);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render undefined when complete event is emitted', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render error when error event is emitted', () => {
      letDirectiveTestComponent.value$ = throwError(() => 'error message');
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('error message');
    });

    it('should call error handler when error event is emitted', () => {
      const errorHandler = TestBed.inject(ErrorHandler);
      const error = new Error('ERROR');
      letDirectiveTestComponent.value$ = throwError(() => error);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(errorHandler.handleError).toHaveBeenCalledWith(error);
    });
  });

  describe('when complete', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponentComplete));

    it('should render true if completed', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    });
  });

  describe('when suspense', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponentSuspense));

    it('should not render when first observable is in suspense state', fakeAsync(() => {
      letDirectiveTestComponent.value$ = of(true).pipe(delay(1000));
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('');
      tick(1000);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    }));

    it('should render suspense when next observable is in suspense state', fakeAsync(() => {
      letDirectiveTestComponent.value$ = of(true);
      fixtureLetDirectiveTestComponent.detectChanges();
      letDirectiveTestComponent.value$ = of(false).pipe(delay(1000));
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('suspense');
      tick(1000);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('false');
    }));
  });

  describe('when suspense template is passed', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponentSuspenseTpl));

    it('should render main template when observable emits next event', () => {
      letDirectiveTestComponent.value$ = new BehaviorSubject('ngrx');
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('ngrx');
    });

    it('should render main template when observable emits error event', () => {
      letDirectiveTestComponent.value$ = throwError(() => 'ERROR!');
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render main template when observable emits complete event', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render suspense template when observable does not emit', () => {
      letDirectiveTestComponent.value$ = NEVER;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('Loading...');
    });

    it('should render suspense template when initial observable is in suspense state', fakeAsync(() => {
      letDirectiveTestComponent.value$ = of('component').pipe(delay(100));
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('Loading...');
      tick(100);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('component');
    }));

    it('should render suspense template when next observable is in suspense state', fakeAsync(() => {
      letDirectiveTestComponent.value$ = new BehaviorSubject('ngrx');
      fixtureLetDirectiveTestComponent.detectChanges();
      letDirectiveTestComponent.value$ = timer(100).pipe(
        switchMap(() => throwError(() => 'ERROR!'))
      );
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('Loading...');
      tick(100);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    }));
  });

  describe('when rendering recursively', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestRecursionComponent));

    it('should render 2nd emitted value if the observable emits while the view is being rendered', fakeAsync(() => {
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(letDirectiveTestComponent).toBeDefined();
      expect(componentNativeElement.textContent).toBe('1');
    }));
  });
});
