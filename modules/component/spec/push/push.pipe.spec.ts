import { PushPipe } from '../../src/push';
import { async, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { getGlobalThis } from '../../src/core/utils';

let ngZone: NgZone;
let pushPipe: PushPipe;

let id = 0;
function MockRequestAnimationFrame(cb: Function) {
  cb && cb();
  return ++id;
}

class MockNgZone extends NgZone {
  constructor() {
    super({ enableLongStackTrace: false });
  }
}
class MockChangeDetectorRef {
  public markForCheck(): void {}
  public detectChanges(): void {}
}

fdescribe('PushPipe', () => {
  getGlobalThis().requestAnimationFrame = undefined;
  getGlobalThis().__zone_symbol__requestAnimationFrame = MockRequestAnimationFrame;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PushPipe],
      providers: [
        PushPipe,
        { provide: NgZone, useClass: MockNgZone },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      ],
    });
    ngZone = TestBed.get(NgZone);
    pushPipe = TestBed.get(PushPipe);
  }));

  it('create an instance', () => {
    expect(pushPipe).toBeDefined();
  });
});
