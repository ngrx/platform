// #docregion
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// #docregion imports
import { StoreModule } from '@ngrx/store';
import { counterFeature } from './counter.reducer';
// #enddocregion imports
import { MyCounterComponent } from './my-counter/my-counter.component';

@NgModule({
  declarations: [AppComponent, MyCounterComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(counterFeature),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
