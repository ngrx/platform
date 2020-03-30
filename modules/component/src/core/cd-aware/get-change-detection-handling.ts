import {
  ChangeDetectorRef,
  NgZone,
  ɵdetectChanges as detectChanges,
  ɵmarkDirty as markDirty,
} from '@angular/core';

import { isIvy } from '../utils/is-ivy';
import { hasZone } from '../utils/has-zone';

export function getChangeDetectionHandler(
  ngZone: NgZone,
  cdRef: ChangeDetectorRef
): <T>(component?: T) => void {
  if (isIvy()) {
    return hasZone(ngZone) ? markDirty : detectChanges;
  } else {
    return hasZone(ngZone)
      ? cdRef.markForCheck.bind(cdRef)
      : cdRef.detectChanges.bind(cdRef);
  }
}
