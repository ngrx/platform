import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import '../src/add/operator/enterZone';

declare var Zone;

describe('enterZone Operator', function() {
  it('should cause an observable stream to enter the ng zone', function(done) {
    const zone = new NgZone({ enableLongStackTrace: false });

    Observable.of(1)
      .enterZone(zone)
      .map(() => Zone.current.name)
      .subscribe({
        next(name) {
          expect(name).toEqual('angular');
          done();
        },
        error(err) {
          done(err);
        }
      });
  });
});
