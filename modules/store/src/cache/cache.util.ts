import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { LruCache } from 'modules/store/src/cache/lru.cache';
import { FifoCache } from 'modules/store/src/cache/fifo.cache';

export function validateCacheSize(cacheSize: number) {
  if (cacheSize === undefined) {
    throw new Error('Missing the required property "cacheSize".');
  }
  if (!Number.isInteger(cacheSize) || cacheSize <= 0) {
    throw new Error(
      'The "cacheSize" property must be a positive integer value.'
    );
  }
}

export const DEFAULT_CACHE_SIZE = 20;

export function createUnboundedCache<
  Props,
  Cache extends
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>
>(): SelectorCache<Cache> {
  return new Map<Props, Cache>();
}

export enum CacheStrategy {
  UNBOUNDED,
  FIFO,
  LRU,
}

export type KeySelector = (...args: any[]) => any;

export interface CacheConfig<Props = any> {
  maxSize?: number;
  strategy?: CacheStrategy;
  keySelector?: string | KeySelector;
}

export interface SelectorCache<
  Cache extends
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>
> {
  get(key: any): Cache | undefined;

  set(key: any, value: Cache): void;

  delete(key: any): void;

  clear(): void;
}

export function createCache<
  Props,
  Cache extends
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>
>(cacheConfig: CacheConfig<Props> = {}): SelectorCache<Cache> {
  switch (cacheConfig.strategy) {
    case CacheStrategy.FIFO:
      return new FifoCache<Props, Cache>(cacheConfig.maxSize);
      break;
    case CacheStrategy.LRU:
      return new LruCache<Props, Cache>(cacheConfig.maxSize);
      break;
    case CacheStrategy.UNBOUNDED:
    default:
      return createUnboundedCache<Props, Cache>();
  }
}

export const defaultKeySelector = (props: any) => props;

export function createKeySelector<Props>(
  cacheConfig: CacheConfig<Props>
): KeySelector {
  if (!cacheConfig.keySelector) return defaultKeySelector;
  else {
    if (typeof cacheConfig.keySelector === 'string') {
      return (prop: any) => prop[cacheConfig.keySelector as keyof Props];
    } else if (typeof cacheConfig.keySelector === 'function') {
      return cacheConfig.keySelector;
    } else {
      throw new Error('keySelector must be a string or function');
    }
  }
}
