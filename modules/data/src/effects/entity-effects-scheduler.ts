import { InjectionToken } from '@angular/core';
import { SchedulerLike } from 'rxjs';

// See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
/** Token to inject a special RxJS Scheduler during marble tests. */
export const ENTITY_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>(
  '@ngrx/data Entity Effects Scheduler'
);
