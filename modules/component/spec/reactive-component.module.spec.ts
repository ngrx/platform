import { TestBed } from '@angular/core/testing';
import { ReactiveComponentModule } from '../src/reactive-component.module';

describe('ReactiveComponentModule', () => {
  let reactiveComponentModule: ReactiveComponentModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveComponentModule],
    });

    reactiveComponentModule = TestBed.inject(ReactiveComponentModule);
  });

  it('should be initialized', () => {
    expect(reactiveComponentModule).toBeDefined();
  });
});
