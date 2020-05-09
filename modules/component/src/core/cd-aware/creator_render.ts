import { ChangeDetectorRef, NgZone } from '@angular/core';
import { isNgZone } from '../utils';

export interface RenderConfig {
  ngZone: NgZone;
  cdRef: ChangeDetectorRef;
}

export function createRender<T>(config: RenderConfig): () => void {
  function render() {
    if (isNgZone(config.ngZone)) {
      config.cdRef.markForCheck();
    } else {
      config.cdRef.detectChanges();
    }
  }

  return render;
}
