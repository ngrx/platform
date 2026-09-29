import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';

import { provideZonelessChangeDetection, NgModule } from '@angular/core';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { getTestBed } from '@angular/core/testing';
import { API_REPORT_DATA } from './app/reference/api-report.token';

@NgModule({
  providers: [
    provideZonelessChangeDetection(),
    {
      provide: API_REPORT_DATA,
      useValue: {
        getData: () => ({ packageNames: [], packages: {} }),
      },
    },
  ],
})
export class ZonelessTestModule {}

getTestBed().initTestEnvironment(
  [BrowserTestingModule, ZonelessTestModule],
  platformBrowserTesting()
);
