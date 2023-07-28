import { NgZone, inject } from '@angular/core';

export type ZoneConfig =
  | { connectOutsideZone: true; ngZone: NgZone }
  | { connectOutsideZone: false; ngZone: null };

export function injectZoneConfig(connectOutsideZone: boolean) {
  const ngZone = connectOutsideZone ? inject(NgZone) : null;
  return { ngZone, connectOutsideZone } as ZoneConfig;
}
