import {
  createNativeStrategy,
  createOptimizedStrategy,
  getGlobalThis,
} from '../../../src/core';
import {
  getMockOptimizedStrategyConfig,
  getMockNoopStrategyConfig,
} from '../../fixtures/fixtures';
import { TestScheduler } from 'rxjs/testing';
import { jestMatcher } from '../../rx-marbles';

let testScheduler: TestScheduler;

// In THIS test setup Zone is initiated and __zone_symbol__Promise has already value
const original__zone_symbol__Promise =
  getGlobalThis().__zone_symbol__Promise || Promise;
function restoreGlobalThis() {
  getGlobalThis().__zone_symbol__Promise = original__zone_symbol__Promise;
}

describe('strategies', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler(jestMatcher);
  });

  describe('createNativeStrategy', () => {
    it('should return a strategy named `native`', () => {
      const strategy = createNativeStrategy(getMockOptimizedStrategyConfig());
      expect(strategy.name).toBe('native');
    });

    it('should call the renderMethod `ChangeDetectorRef#markForCheck`', () => {
      const cfg = getMockOptimizedStrategyConfig();
      const strategy = createNativeStrategy(cfg);
      strategy.render();
      expect(cfg.cdRef.markForCheck).toHaveBeenCalledTimes(1);
    });
  });

  describe('createOptimizedStrategy', () => {
    it('should return a strategy named `optimized`', () => {
      const strategy = createOptimizedStrategy(getMockNoopStrategyConfig());
      expect(strategy.name).toBe('optimized');
    });

    it('should call the renderMethod `ChangeDetectorRef#markForCheck`', () => {
      const cfg = getMockOptimizedStrategyConfig();
      const strategy = createOptimizedStrategy(cfg);
      strategy.render();
      expect(cfg.cdRef.markForCheck).toHaveBeenCalledTimes(1);
      expect(cfg.cdRef.detectChanges()).toHaveBeenCalledTimes(0);
    });
  });
});
