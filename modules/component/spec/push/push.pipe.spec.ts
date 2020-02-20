import { PushPipe } from '../../src/push';
import { async, TestBed } from '@angular/core/testing';
import {
  ChangeDetectorRef,
  Component,
  NgZone as OriginalNgZone,
} from '@angular/core';
import { getGlobalThis, isIvy, isZoneLess } from '../../src/core/utils';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { CoalescingConfig } from '../../src/core';

let pushPipe: PushPipe;

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
    {{ (value$ | ngrxPush: cfg | json) || 'undefined' }}
  `,
})
class PushPipeTestComponent {
  cfg: CoalescingConfig = { optimized: false };
  value$: Observable<number> = of(42);
}

let fixturePushPipeTestComponent: any;
let pushPipeTestComponent: {
  cfg: CoalescingConfig;
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

describe('PushPipe', () => {
  describe('used as a Service', () => {
    getGlobalThis().requestAnimationFrame = undefined;
    getGlobalThis().__zone_symbol__requestAnimationFrame = MockRequestAnimationFrame;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          PushPipe,
          { provide: NgZone, useClass: NgZone },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
        ],
      });
      pushPipe = TestBed.get(PushPipe);
    }));

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
    getGlobalThis().requestAnimationFrame = undefined;
    getGlobalThis().__zone_symbol__requestAnimationFrame = MockRequestAnimationFrame;

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
        expect(componentNativeElement.textContent).toBe('undefined');
      });

      it('should return null as value when initially null was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = null;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('null');
      });

      it('should return undefined as value when initially of(undefined) was passed (as undefined was emitted)', () => {
        pushPipeTestComponent.value$ = of(undefined);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('undefined');
      });

      it('should return null as value when initially of(null) was passed (as null was emitted)', () => {
        pushPipeTestComponent.value$ = of(null);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('null');
      });

      it('should return undefined as value when initially EMPTY was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = EMPTY;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('undefined');
      });

      it('should return undefined as value when initially NEVER was passed (as no value ever was emitted)', () => {
        pushPipeTestComponent.value$ = NEVER;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('undefined');
      });

      it('should return emitted value from passed observable without changing it', () => {
        pushPipeTestComponent.value$ = of(42);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('42');
      });

      it('should return undefined as value when a new observable NEVER was passed (as no value ever was emitted from new observable)', () => {
        pushPipeTestComponent.value$ = of(42);
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('42');
        pushPipeTestComponent.value$ = NEVER;
        fixturePushPipeTestComponent.detectChanges();
        expect(componentNativeElement.textContent).toBe('undefined');
      });
    });
  });

  fdescribe('when used in zone-less', () => {
    let noopNgZone: any;

    beforeEach(async(() => {
      getGlobalThis().requestAnimationFrame = undefined;
      getGlobalThis().__zone_symbol__requestAnimationFrame = MockRequestAnimationFrame;
      getGlobalThis().ng = undefined;

      TestBed.configureTestingModule({
        providers: [
          { provide: NgZone, useClass: NoopNgZone },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
          {
            provide: PushPipe,
            useClass: PushPipe,
            depths: [ChangeDetectorRef, NgZone],
          },
        ],
      });
      pushPipe = TestBed.get(PushPipe);
      noopNgZone = TestBed.get(NgZone);
    }));

    fit('should call dcRef.detectChanges in ViewEngine', () => {
      getGlobalThis().ng = { probe: true };
      expect(isZoneLess(noopNgZone)).toBe(true);
      expect(noopNgZone).toEqual((pushPipe as any).ngZone);
      expect(isZoneLess((pushPipe as any).ngZone)).toBe(true);
      expect(isIvy()).toBe(false);
      expect(pushPipe.handleChangeDetection()).toBe('detectChanges');
    });

    it('should call detectChanges in Ivy', () => {
      getGlobalThis().ng = undefined;
      expect(isZoneLess(noopNgZone)).toBe(true);
      expect(isIvy()).toBe(true);
      // @TODO
      expect(false).toBe('detectChanges');
    });
  });

  describe('when used in zone-full mode', () => {
    let ngZone: NgZone;
    beforeEach(async(() => {
      getGlobalThis().requestAnimationFrame = undefined;
      getGlobalThis().__zone_symbol__requestAnimationFrame = MockRequestAnimationFrame;
      getGlobalThis().ng = undefined;
      TestBed.configureTestingModule({
        providers: [
          PushPipe,
          { provide: NgZone, useClass: NgZone },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
        ],
      });
      pushPipe = TestBed.get(PushPipe);
      ngZone = TestBed.get(NgZone);
    }));

    it('should call dcRef.markForCheck in ViewEngine', () => {
      getGlobalThis().ng = { probe: true };
      expect(isZoneLess(ngZone)).toBe(false);
      expect(isIvy()).toBe(false);
      expect(pushPipe.handleChangeDetection()).toBe('markForCheck');
    });

    it('should call markDirty in Ivy', () => {
      getGlobalThis().ng = undefined;
      expect(isZoneLess(ngZone)).toBe(false);
      expect(isIvy()).toBe(true);
      // @TODO
      expect(false).toBe('markDirty');
    });
  });
});
