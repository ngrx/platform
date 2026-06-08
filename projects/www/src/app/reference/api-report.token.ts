import { InjectionToken } from '@angular/core';
import { MinimizedApiPackageReport } from '@ngrx-io/shared';

export const API_REPORT_DATA = new InjectionToken<MinimizedApiPackageReport>(
  'API_REPORT_DATA'
);
