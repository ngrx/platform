import { ChangeDetectorRef, NgZone } from '@angular/core';

import { hasZone } from '../utils/has-zone';

export interface RenderConfig {
  ngZone: NgZone;
  cdRef: ChangeDetectorRef;
}

export function createRender<T>(config: RenderConfig): () => void {
  function render() {
    if (hasZone(config.ngZone)) {
      config.cdRef.markForCheck();
    } else {
      config.cdRef.detectChanges();
    }
  }

  return render;
}
