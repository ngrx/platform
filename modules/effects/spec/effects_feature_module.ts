import { TestBed } from '@angular/core/testing';
import { EffectSources } from '../src/effect_sources';
import { FEATURE_EFFECTS } from '../src/tokens';
import { EffectsFeatureModule } from '../src/effects_feature_module';

describe('Effects Feature Module', () => {
  const sourceA = 'sourceA';
  const sourceB = 'sourceB';
  const sourceC = 'sourceC';
  const effectSourceGroups = [[sourceA], [sourceB], [sourceC]];
  let mockEffectSources: { addEffects: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EffectSources,
          useValue: {
            addEffects: jasmine.createSpy('addEffects'),
          },
        },
        {
          provide: FEATURE_EFFECTS,
          useValue: effectSourceGroups,
        },
        EffectsFeatureModule,
      ],
    });

    mockEffectSources = TestBed.get(mockEffectSources);
  });

  it('should add all effects when instantiated', () => {
    TestBed.get(EffectsFeatureModule);

    expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceA);
    expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceB);
    expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceC);
  });
});
