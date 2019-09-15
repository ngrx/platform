import {
  DEFAULT_CACHE_SIZE,
  SelectorCache,
  validateCacheSize,
} from 'modules/store/src/cache/cache.util';
import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';

export class FifoCache<
  Props,
  Cache extends
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>
> implements SelectorCache<Cache> {
  private cache = new Map<Props, Cache>();

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
    return this.cache.get(key);
  }

  delete(key: Props) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}
