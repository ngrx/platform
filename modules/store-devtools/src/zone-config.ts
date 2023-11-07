import { NgZone, inject } from '@angular/core';

export type ZoneConfig =
  | { connectInZone: true; ngZone: NgZone }
  | { connectInZone: false; ngZone: null };

export function injectZoneConfig(connectInZone: boolean) {
  const ngZone = connectInZone ? inject(NgZone) : null;
  return { ngZone, connectInZone } as ZoneConfig;
}
