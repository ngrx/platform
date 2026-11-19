import { InjectionToken } from '@angular/core';
import { SchedulerLike } from 'rxjs';

// See https://rxjs.dev/guide/testing/marble-testing
/** Token to inject a special RxJS Scheduler during marble tests. */
export const ENTITY_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>(
  '@ngrx/data Entity Effects Scheduler'
);
