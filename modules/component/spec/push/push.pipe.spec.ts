import { ChangeDetectorRef, Component, ErrorHandler } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  BehaviorSubject,
  EMPTY,
  NEVER,
  Observable,
  ObservableInput,
  of,
  throwError,
} from 'rxjs';
import { PushPipe } from '../../src/push/push.pipe';
import { MockChangeDetectorRef, MockErrorHandler } from '../fixtures/fixtures';

let pushPipe: PushPipe;

function wrapWithSpace(str: string): string {
  return ' ' + str + ' ';
}

@Component({
  template: ` {{ (value$ | ngrxPush | json) || 'undefined' }} `,
})
class PushPipeTestComponent {
  value$: Observable<number> = of(42);
}

let fixturePushPipeTestComponent: ComponentFixture<PushPipeTestComponent>;
let pushPipeTestComponent: {
  value$: ObservableInput<any> | undefined | null;
};
let componentNativeElement: any;

const setupPushPipeComponent = () => {
  TestBed.configureTestingModule({
    providers: [
      PushPipe,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      { provide: ErrorHandler, useClass: MockErrorHandler },
    ],
  });
  pushPipe = TestBed.inject(PushPipe);
};

describe('PushPipe', () => {
  describe('used as a Service', () => {
    beforeEach(waitForAsync(setupPushPipeComponent));

    it('should be instantiable', () => {
      expect(pushPipe).toBeDefined();
    });

    describe('transform function', () => {
      it('should return undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
        expect(pushPipe.transform(undefined)).toBe(undefined);
      });

      it('should return null as value when initially null was passed (as no value ever was emitted)', () => {
        expect(pushPipe.transform(null)).toBe(null);
      });

      it('should return undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
        expect(pushPipe.transform(of(undefined))).toBe(undefined);
      });

      it('should return null as value when initially of(null) was passed (as null was emitted)', () => {
        expect(pushPipe.transform(of(null))).toBe(null);
      });

      it('should return undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
        expect(pushPipe.transform(EMPTY)).toBe(undefined);
      });

      it('should return undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
        expect(pushPipe.transform(NEVER)).toBe(undefined);
      });

      it('should return undefined as value when error observable is initially passed', () => {
        expect(pushPipe.transform(throwError(() => 'ERROR!'))).toBe(undefined);
      });

      it('should call error handler when error observable is passed', () => {
        const errorHandler = TestBed.inject(ErrorHandler);
        pushPipe.transform(throwError(() => 'ERROR!'));
        expect(errorHandler.handleError).toHaveBeenCalledWith('ERROR!');
      });

      it('should return emitted value from passed observable without changing it', () => {
        expect(pushPipe.transform(of(42))).toBe(42);
      });

      it('should return emitted value from passed promise without changing it', (done) => {
        const promise = Promise.resolve(42);
        pushPipe.transform(promise);
        setTimeout(() => {
          expect(pushPipe.transform(promise)).toBe(42);
          done();
        });
      });

      it('should return undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
        expect(pushPipe.transform(of(42))).toBe(42);
        expect(pushPipe.transform(NEVER)).toBe(undefined);
      });

      it('should return undefined as value when new error observable is passed', () => {
        expect(pushPipe.transform(of(10))).toBe(10);
        expect(pushPipe.transform(throwError(() => 'ERROR!'))).toBe(undefined);
      });
    });
  });

  describe('used as a Pipe', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PushPipe, PushPipeTestComponent],
        providers: [{ provide: ErrorHandler, useClass: MockErrorHandler }],
      });

      fixturePushPipeTestComponent = TestBed.createComponent(
        PushPipeTestComponent
      );
      pushPipeTestComponent = fixturePushPipeTestComponent.componentInstance;
      componentNativeElement = fixturePushPipeTestComponent.nativeElement;
    });

    it('should be instantiable', () => {
      expect(fixturePushPipeTestComponent).toBeDefined();
      expect(pushPipeTestComponent).toBeDefined();
      expect(componentNativeElement).toBeDefined();
    });

    describe('transform function', () => {
      it('should return undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = undefined;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should return null as value when initially null was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = null;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('null'));
      });

      it('should return undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
        pushPipeTestComponent.value$ = of(undefined);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should return null as value when initially of(null) was passed (as null was emitted)', () => {
        pushPipeTestComponent.value$ = of(null);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('null'));
      });

      it('should return undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = EMPTY;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should return undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = NEVER;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should render undefined when error observable is initially passed', () => {
        pushPipeTestComponent.value$ = throwError(() => 'ERROR!');
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should call error handler when error observable is passed', () => {
        const errorHandler = TestBed.inject(ErrorHandler);
        pushPipeTestComponent.value$ = throwError(() => 'ERROR!');
        fixturePushPipeTestComponent.detectChanges();
        expect(errorHandler.handleError).toHaveBeenCalledWith('ERROR!');
      });

      it('should emitted value from passed observable without changing it', () => {
        pushPipeTestComponent.value$ = of(42);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('42'));
      });

      it('should emitted value from passed promise without changing it', fakeAsync(() => {
        pushPipeTestComponent.value$ = Promise.resolve(42);
        fixturePushPipeTestComponent.detectChanges();
        flushMicrotasks();
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('42'));
      }));

      it('should return undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
        pushPipeTestComponent.value$ = of(42);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('42'));
        pushPipeTestComponent.value$ = NEVER;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should render emitted value when error event is emitted after next event', () => {
        const subject = new BehaviorSubject(1000);
        pushPipeTestComponent.value$ = subject;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('1000'));
        subject.error('ERROR!');
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('1000'));
      });

      it('should render undefined when new error observable is passed', () => {
        pushPipeTestComponent.value$ = of(10);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('10'));
        pushPipeTestComponent.value$ = throwError(() => 'ERROR!');
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });
    });
  });
});
