import {
  ChangeDetectorRef,
  NgZone,
  ɵdetectChanges as detectChanges,
  ɵmarkDirty as markDirty,
} from '@angular/core';

import { isIvy } from './is-ivy';
import { isZoneLess } from './is-zone-less';

export function getChangeDetectionHandler(
  ngZone: NgZone,
  cdRef: ChangeDetectorRef
): <T>(component?: T) => void {
  if (isIvy()) {
    return isZoneLess(ngZone) ? detectChanges : markDirty;
  } else {
    return isZoneLess(ngZone)
      ? cdRef.detectChanges.bind(cdRef)
      : cdRef.markForCheck.bind(cdRef);
  }
}
