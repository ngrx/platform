import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  mergeApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { App } from './app.component';
import { appConfig } from './app.config';

const config = mergeApplicationConfig(appConfig, {
  providers: [provideExperimentalZonelessChangeDetection()],
});

bootstrapApplication(App, config);
