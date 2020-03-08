import { TestBed } from '@angular/core/testing';
import { ComponentModule } from '../';

describe('Component Module', () => {
  let componentModule: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentModule],
    });

    componentModule = TestBed.get(ComponentModule);
  });

  it('should add all effects when instantiated', () => {
    expect(componentModule).toBeDefined();
  });
});
