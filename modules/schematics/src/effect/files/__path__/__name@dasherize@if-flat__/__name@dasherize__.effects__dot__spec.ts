import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { <%= classify(name) %>Effects } from './<%= dasherize(name) %>.effects';

describe('<%= classify(name) %>Service', () => {
  let actions$: Observable<any>;
  let effects: <%= classify(name) %>Effects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        <%= classify(name) %>Effects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(<%= classify(name) %>Effects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
