import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { counterReducer } from './counter.reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideStore({ count: counterReducer })],
};
