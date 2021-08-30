import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreModule, InMemoryDataService } from './core';
import {
  HttpClientInMemoryWebApiModule,
  InMemoryDbService,
} from 'angular-in-memory-web-api';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    loadChildren: () =>
      import('./heroes/heroes.module').then((m) => m.HeroesModule),
  },
  {
    path: 'villains',
    loadChildren: () =>
      import('./villains/villains.module').then((m) => m.VillainsModule),
  },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      delay: 300,
      passThruUnknownUrl: true,
    }),
  ],
  providers: [{ provide: InMemoryDataService, useExisting: InMemoryDbService }],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
