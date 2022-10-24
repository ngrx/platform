import { ChangeDetectorRef, Component, ErrorHandler } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject, delay, EMPTY, NEVER, of, throwError } from 'rxjs';
import { PushPipe } from '../../src/push/push.pipe';
import { MockChangeDetectorRef, MockErrorHandler } from '../fixtures/fixtures';
import { stripSpaces, wrapWithSpace } from '../helpers';

let pushPipe: PushPipe;

@Component({
  template: ` {{ (value$ | ngrxPush | json) || 'undefined' }} `,
})
class PushPipeTestComponent {
  value$: unknown = of(42);
}

let fixturePushPipeTestComponent: ComponentFixture<PushPipeTestComponent>;
let pushPipeTestComponent: {
  value$: unknown;
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

      it('should return initially passed number', () => {
        expect(pushPipe.transform(10)).toBe(10);
      });

      it('should return initially passed string', () => {
        expect(pushPipe.transform('ngrx')).toBe('ngrx');
      });

      it('should return initially passed boolean', () => {
        expect(pushPipe.transform(true)).toBe(true);
      });

      it('should return initially passed empty object', () => {
        const obj = {};
        expect(pushPipe.transform(obj)).toBe(obj);
      });

      it('should return initially passed object with non-observable values', () => {
        const obj = { ngrx: 'component' };
        expect(pushPipe.transform(obj)).toBe(obj);
      });

      it('should return initially passed object with at least one non-observable value', () => {
        const obj = { ngrx: 'component', obs$: of(10) };
        expect(pushPipe.transform(obj)).toBe(obj);
      });

      it('should return initially passed array', () => {
        const arr = [1, 2, 3];
        expect(pushPipe.transform(arr)).toBe(arr);
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

      it('should return undefined when any observable from dictionary emits first value asynchronously', () => {
        const result = pushPipe.transform({
          o1$: of(1).pipe(delay(1)),
          o2$: of(2),
        });
        expect(result).toBe(undefined);
      });

      it('should return emitted values from observables that are passed as dictionary and emit first values synchronously', () => {
        const result = pushPipe.transform({ o1: of(10), o2: of(20) });
        expect(result).toEqual({ o1: 10, o2: 20 });
      });

      it('should return undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
        expect(pushPipe.transform(of(42))).toBe(42);
        expect(pushPipe.transform(NEVER)).toBe(undefined);
      });

      it('should return undefined as value when new error observable is passed', () => {
        expect(pushPipe.transform(of(10))).toBe(10);
        expect(pushPipe.transform(throwError(() => 'ERROR!'))).toBe(undefined);
      });

      it('should return non-observable value when it was passed after observable', () => {
        expect(pushPipe.transform(of('ngrx'))).toBe('ngrx');
        expect(pushPipe.transform('component')).toBe('component');
      });

      it('should return non-observable value when it was passed after another non-observable', () => {
        expect(pushPipe.transform(100)).toBe(100);
        expect(pushPipe.transform('ngrx')).toBe('ngrx');
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
      it('should render undefined as value when initially undefined was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = undefined;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should render null as value when initially null was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = null;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('null'));
      });

      it('should render initially passed number', () => {
        pushPipeTestComponent.value$ = 1000;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('1000'));
      });

      it('should render initially passed string', () => {
        pushPipeTestComponent.value$ = 'ngrx';
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('"ngrx"')
        );
      });

      it('should render initially passed boolean', () => {
        pushPipeTestComponent.value$ = true;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('true'));
      });

      it('should render initially passed empty object', () => {
        pushPipeTestComponent.value$ = {};
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe('{}');
      });

      it('should render initially passed object with non-observable values', () => {
        pushPipeTestComponent.value$ = { ngrx: 'component' };
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe(
          '{"ngrx":"component"}'
        );
      });

      it('should render initially passed object with at least one non-observable value', () => {
        pushPipeTestComponent.value$ = { ngrx: 'component', o: of('ngrx') };
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe(
          '{"ngrx":"component","o":{}}'
        );
      });

      it('should render initially passed array', () => {
        pushPipeTestComponent.value$ = [1, 2, 3];
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe('[1,2,3]');
      });

      it('should render undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
        pushPipeTestComponent.value$ = of(undefined);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should render null as value when initially of(null) was passed (as null was emitted)', () => {
        pushPipeTestComponent.value$ = of(null);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('null'));
      });

      it('should render undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = EMPTY;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should render undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
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

      it('should render emitted value from passed observable without changing it', () => {
        pushPipeTestComponent.value$ = of(42);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('42'));
      });

      it('should render emitted value from passed promise without changing it', fakeAsync(() => {
        pushPipeTestComponent.value$ = Promise.resolve(42);
        fixturePushPipeTestComponent.detectChanges();
        flushMicrotasks();
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('42'));
      }));

      it('should render undefined initially when any observable from dictionary emits first value asynchronously', () => {
        pushPipeTestComponent.value$ = {
          o1: of(100),
          o2: of(200).pipe(delay(1)),
        };
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('undefined')
        );
      });

      it('should render emitted values from observables that are passed as dictionary', () => {
        const o1 = new BehaviorSubject('ng');
        const o2 = new BehaviorSubject('rx');
        pushPipeTestComponent.value$ = { o1, o2 };
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe(
          '{"o1":"ng","o2":"rx"}'
        );

        o1.next('ngrx');
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe(
          '{"o1":"ngrx","o2":"rx"}'
        );

        o2.next('component');
        fixturePushPipeTestComponent.detectChanges();
        expect(stripSpaces(componentNativeElement.textContent)).toBe(
          '{"o1":"ngrx","o2":"component"}'
        );
      });

      it('should render undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
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

      it('should render non-observable value when it was passed after observable', () => {
        pushPipeTestComponent.value$ = of('ngrx');
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('"ngrx"')
        );
        pushPipeTestComponent.value$ = 'component';
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(
          wrapWithSpace('"component"')
        );
      });

      it('should render non-observable value when it was passed after another non-observable', () => {
        pushPipeTestComponent.value$ = 10;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('10'));
        pushPipeTestComponent.value$ = 100;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('100'));
      });
    });
  });
});
