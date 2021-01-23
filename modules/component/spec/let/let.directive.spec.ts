import {
  ChangeDetectorRef,
  Component,
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
  EMPTY,
  interval,
  NEVER,
  Observable,
  ObservableInput,
  of,
  throwError,
} from 'rxjs';
import { take } from 'rxjs/operators';

import { LetDirective } from '../../src/let/let.directive';
import { MockChangeDetectorRef } from '../fixtures/fixtures';

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
    <ng-container *ngrxLet="value$; $error as error">{{ error }}</ng-container>
  `,
})
class LetDirectiveTestErrorComponent {
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
  value$: Observable<number> = of(42);
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

describe('LetDirective', () => {
  describe('when nexting values', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponent));

    it('should be instantiable', () => {
      expect(fixtureLetDirectiveTestComponent).toBeDefined();
      expect(letDirectiveTestComponent).toBeDefined();
      expect(componentNativeElement).toBeDefined();
    });

    it('should render_creator undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = undefined;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render_creator null as value when initially null was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = null;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('null');
    });

    it('should render_creator undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
      letDirectiveTestComponent.value$ = of(undefined);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render_creator null as value when initially of(null) was passed (as null was emitted)', () => {
      letDirectiveTestComponent.value$ = of(null);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('null');
    });

    it('should render_creator undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render_creator nothing as value when initially NEVER was passed (as no value ever was emitted)', () => {
      letDirectiveTestComponent.value$ = NEVER;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('');
    });

    it('should render_creator emitted value from passed observable without changing it', () => {
      letDirectiveTestComponent.value$ = of(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
    });

    it('should render_creator emitted value from passed promise without changing it', fakeAsync(() => {
      letDirectiveTestComponent.value$ = Promise.resolve(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      flushMicrotasks();
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
    }));

    it('should render_creator undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
      letDirectiveTestComponent.value$ = of(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
      letDirectiveTestComponent.value$ = NEVER;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('undefined');
    });

    it('should render_creator new value as value when a new observable was passed', () => {
      letDirectiveTestComponent.value$ = of(42);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('42');
      letDirectiveTestComponent.value$ = of(45);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('45');
    });

    it('should render_creator the last value when a new observable was passed', () => {
      letDirectiveTestComponent.value$ = of(42, 45);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('45');
    });

    it('should render_creator values over time when a new observable was passed', fakeAsync(() => {
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

    it('should render_creator the error to false if next or complete', () => {
      letDirectiveTestComponent.value$ = of(1);
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('false');
    });

    it('should render_creator the error to true if one occurs', () => {
      letDirectiveTestComponent.value$ = throwError(new Error('error message'));
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    });
  });

  describe('when complete', () => {
    beforeEach(waitForAsync(setupLetDirectiveTestComponentComplete));

    it('should render_creator true if completed', () => {
      letDirectiveTestComponent.value$ = EMPTY;
      fixtureLetDirectiveTestComponent.detectChanges();
      expect(componentNativeElement.textContent).toBe('true');
    });
  });
});
