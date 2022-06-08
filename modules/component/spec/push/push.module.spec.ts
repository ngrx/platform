import { TestBed } from '@angular/core/testing';
import { PushModule } from '../../src/push/push.module';

describe('PushModule', () => {
  let pushModule: PushModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PushModule],
    });

    pushModule = TestBed.inject(PushModule);
  });

  it('should be initialized', () => {
    expect(pushModule).toBeDefined();
  });
});
