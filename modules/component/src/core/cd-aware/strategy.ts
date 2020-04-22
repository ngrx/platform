import { ChangeDetectorRef } from '@angular/core';
import { envZonePatched } from '../utils';

export interface StrategyFactoryConfig {
  cdRef: ChangeDetectorRef;
}

export interface CdStrategy<T> {
  render: () => void;
  name: string;
}

export const DEFAULT_STRATEGY_NAME = 'native';

export interface StrategySet<U> {
  [strategy: string]: CdStrategy<U>;
}
export function getStrategies<T>(config: {
  cdRef: ChangeDetectorRef;
}): StrategySet<T> {
  return {
    native: createNativeStrategy<T>(config),
    optimized: createOptimizedStrategy<T>(config),
  };
}
/**
 * Native Strategy
 * @description
 *
 * This strategy mirrors Angular's built-in `async` pipe.
 * This means for every emitted value `ChangeDetectorRef#markForCheck` is called.
 *
 * @param config { StrategyFactoryConfig } - The values this strategy needs to get calculated.
 * @return {CdStrategy<T>} - The calculated strategy
 *
 */
export function createNativeStrategy<T>(
  config: StrategyFactoryConfig
): CdStrategy<T> {
  return {
    render: (): void => config.cdRef.markForCheck(),
    name: 'native',
  };
}

/**
 *
 * Optimized Strategy
 *
 * This strategy is rendering the application root and
 * all it's children that are on a path
 * that is marked as dirty or has components with `ChangeDetectionStrategy.Default`.
 *
 * @param config { StrategyFactoryConfig } - The values this strategy needs to get calculated.
 * @return {CdStrategy<T>} - The calculated strategy
 *
 */
export function createOptimizedStrategy<T>(
  config: StrategyFactoryConfig
): CdStrategy<T> {
  function render() {
    if (envZonePatched()) {
      config.cdRef.markForCheck();
    } else {
      config.cdRef.detectChanges();
    }
  }

  return {
    render,
    name: 'optimized',
  };
}
