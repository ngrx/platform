import { TestBed } from '@angular/core/testing';
import { LetModule } from '../../src/let/let.module';

describe('LetModule', () => {
  let letModule: LetModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LetModule],
    });

    letModule = TestBed.inject(LetModule);
  });

  it('should be initialized', () => {
    expect(letModule).toBeDefined();
  });
});
