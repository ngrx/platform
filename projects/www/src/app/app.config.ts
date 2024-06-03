import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import {
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideContent,
  withMarkdownRenderer,
  MarkedSetupService,
} from '@analogjs/content';
import { NgRxMarkedSetupService } from './services/markdown.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling()
    ),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideContent(withMarkdownRenderer()),
    {
      provide: MarkedSetupService,
      useClass: NgRxMarkedSetupService,
    },
  ],
};
