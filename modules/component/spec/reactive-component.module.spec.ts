import { TestBed } from '@angular/core/testing';
import { ReactiveComponentModule } from '../';

describe('Component Module', () => {
  let componentModule: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveComponentModule],
    });

    componentModule = TestBed.get(ReactiveComponentModule);
  });

  it('should add all effects when instantiated', () => {
    expect(componentModule).toBeDefined();
  });
});
