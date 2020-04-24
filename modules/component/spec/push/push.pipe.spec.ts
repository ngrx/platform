import { PushPipe } from '../../src/push';
import { async, TestBed } from '@angular/core/testing';
import {
  ChangeDetectorRef,
  Component,
  NgZone as OriginalNgZone,
} from '@angular/core';
import { getGlobalThis, isIvy, hasZone } from '../../src/core/utils';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { CoalescingConfig } from '../../src/core';

let pushPipe: PushPipe<unknown>;

function wrapWithSpace(str: string): string {
  return ' ' + str + ' ';
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
let noopNgZone: NoopNgZone;
let ngZone: NgZone;

const setupPushPipeComponent = () => {
  TestBed.configureTestingModule({
    providers: [
      PushPipe,
      NgZone,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
    ],
  });
  pushPipe = TestBed.inject(PushPipe);
};
const setupPushPipeComponentZoneLess = () => {
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
  pushPipe = TestBed.inject(PushPipe);
  noopNgZone = TestBed.inject(NgZone);
};

const setupPushPipeComponentZoneFull = () => {
  getGlobalThis().ng = undefined;
  TestBed.configureTestingModule({
    providers: [
      PushPipe,
      NgZone,
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
    ],
  });
  pushPipe = TestBed.inject(PushPipe);
  ngZone = TestBed.inject(NgZone);
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

      it('should return emitted value from passed observable without changing it', () => {
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

  xdescribe('when used in zone-less', () => {
    beforeEach(async(setupPushPipeComponentZoneLess));

    it('should call dcRef.detectChanges in ViewEngine', () => {
      getGlobalThis().ng = { probe: true };
      const ngZone = (pushPipe as any).ngZone;
      expect(!hasZone(noopNgZone as NgZone)).toBe(true);
      expect(noopNgZone).toBe(ngZone);
      expect(!hasZone(ngZone)).toBe(true);
      expect(isIvy()).toBe(false);
      // TODO(LayZeeDK) no method by that name, @BioPhoton
      // expect(pushPipe.handleChangeDetection.name).toBe('detectChanges');
    });

    it('should call detectChanges in Ivy', () => {
      getGlobalThis().ng = undefined;
      expect(!hasZone(noopNgZone as NgZone)).toBe(true);
      expect(isIvy()).toBe(true);
      // @TODO
      expect(false).toBe('detectChanges');
    });
  });

  xdescribe('when used in zone-full mode', () => {
    beforeEach(async(setupPushPipeComponentZoneFull));

    it('should call dcRef.markForCheck in ViewEngine', () => {
      getGlobalThis().ng = { probe: true };
      expect(!hasZone(ngZone)).toBe(false);
      expect(isIvy()).toBe(false);
      // TODO(LayZeeDK) no method by that name, @BioPhoton
      // expect(pushPipe.handleChangeDetection()).toBe('markForCheck');
    });

    it('should call markDirty in Ivy', () => {
      getGlobalThis().ng = undefined;
      expect(!hasZone(ngZone)).toBe(false);
      expect(isIvy()).toBe(true);
      // @TODO
      expect(false).toBe('markDirty');
    });
  });
});
