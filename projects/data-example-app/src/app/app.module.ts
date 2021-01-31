import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EntityDataModule } from '@ngrx/data';
import { storyEntityMetadata } from '../state/story.metadata';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  HTTP_INTERCEPTORS,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FakeBackendInterceptor } from '../fake-backend-interceptor.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument(),
    EntityDataModule.forRoot({
      entityMetadata: {
        Story: storyEntityMetadata,
      },
      pluralNames: {
        Story: 'stories',
      },
    }),
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: FakeBackendInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
