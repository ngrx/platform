import {
  ChangeDetectorRef,
  Component,
  NgZone as OriginalNgZone,
} from '@angular/core';
import { CoalescingConfig } from '../../src/core';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';
import { PushPipe } from '@ngrx/component';

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
    <ng-container *ngrxLet="value$ as value">
      {{ (value | json) || 'undefined' }}
    </ng-container>
  `,
})
class LetDirectiveTestComponent {
  cfg: CoalescingConfig = { optimized: false };
  value$: Observable<number> = of(42);
}

let fixtureLetDirectiveTestComponent: any;
let letDirectiveTestComponent: {
  cfg: CoalescingConfig;
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

fdescribe('LetDirective', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        PushPipe,
        { provide: NgZone, useClass: NgZone },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      ],
    });
    letDirective = TestBed.get(PushPipe);
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
