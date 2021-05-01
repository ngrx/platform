import { Component, Input } from '@angular/core';
import { VersionInfo } from 'app/navigation/navigation.service';

@Component({
    selector: 'aio-mode-banner',
    template: `
  <div *ngIf="mode == 'archive'" class="mode-banner">
    This is the <strong>archived documentation for NgRx v{{version?.major}}.</strong>
    Please visit <a href="https://ngrx.io/">ngrx.io</a> to see documentation for the current version of NgRx.
  </div>
  `
})
export class ModeBannerComponent {
    @Input() mode: string;
    @Input() version: VersionInfo;
}
