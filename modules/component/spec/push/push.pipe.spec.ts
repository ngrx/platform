import { ChangeDetectorRef, Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { EMPTY, NEVER, Observable, of } from 'rxjs';

import { PushPipe } from '../../src/push/push.pipe';
import { MockChangeDetectorRef } from '../fixtures/fixtures';

let pushPipe: PushPipe<unknown>;

function wrapWithSpace(str: string): string {
  return ' ' + str + ' ';
}

@Component({
  template: ` {{ (value$ | ngrxPush | json) || 'undefined' }} `,
})
class PushPipeTestComponent {
  value$: Observable<number> = of(42);
}

let fixturePushPipeTestComponent: any;
let pushPipeTestComponent: {
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

const setupPushPipeComponent = () => {
  TestBed.configureTestingModule({
    providers: [
      PushPipe,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
    ],
  });
  pushPipe = TestBed.inject(PushPipe);
};

describe('PushPipe', () => {
  describe('used as a Service', () => {
    beforeEach(async(setupPushPipeComponent));

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

      it('should return emitted value from passed observable without changing it', () => {
        expect(pushPipe.transform(of(42))).toBe(42);
      });

      it('should return undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
        expect(pushPipe.transform(of(42))).toBe(42);
        expect(pushPipe.transform(NEVER)).toBe(undefined);
      });
    });
  });

  describe('used as a Pipe', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PushPipe, PushPipeTestComponent],
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

      it('should emitted value from passed observable without changing it', () => {
        pushPipeTestComponent.value$ = of(42);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe(wrapWithSpace('42'));
      });

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
    });
  });
});
