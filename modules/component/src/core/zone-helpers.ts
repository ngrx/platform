import { NgZone } from '@angular/core';

export function isNgZone(zone: unknown): zone is NgZone {
  return zone instanceof NgZone;
}
