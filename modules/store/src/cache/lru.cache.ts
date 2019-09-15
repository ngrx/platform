import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import {
  DEFAULT_CACHE_SIZE,
  SelectorCache,
  validateCacheSize,
} from 'modules/store/src/cache/cache.util';

export class LruCache<
  Props,
  Cache extends
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>
> implements SelectorCache<Cache> {
  private cache: Map<Props, Cache> = new Map();

  constructor(private readonly cacheSize: number = DEFAULT_CACHE_SIZE) {
    validateCacheSize(cacheSize);
  }

  set(key: Props, selectorFn: Cache) {
    this.cache.set(key, selectorFn);

    if (this.cache.size > this.cacheSize) {
      const earliest = this.cache.keys().next().value;
      this.delete(earliest);
    }
  }

  get(key: Props) {
    const value = this.cache.get(key);

    // Register cache hit
    if (this.cache.has(key)) {
      this.delete(key);
      this.cache.set(key, value as Cache);
    }
    return value;
  }

  delete(key: Props) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}
