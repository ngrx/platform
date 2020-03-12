import {
  ChangeDetectorRef,
  NgZone,
  ɵdetectChanges as detectChanges,
  ɵmarkDirty as markDirty,
} from '@angular/core';

import { isIvy } from './is-ivy';
import { hasZone } from './has-zone';

export function getChangeDetectionHandler(
  ngZone: NgZone,
  cdRef: ChangeDetectorRef
): <T>(component?: T) => void {
  if (isIvy()) {
    return !hasZone(ngZone) ? detectChanges : markDirty;
  } else {
    return !hasZone(ngZone)
      ? cdRef.detectChanges.bind(cdRef)
      : cdRef.markForCheck.bind(cdRef);
  }
}
