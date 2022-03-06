import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './car/car.reducer';
import { CarComponent } from './car/car.component';
import { RouterModule } from '@angular/router';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ cars: reducer, router: routerReducer }),
    RouterModule.forRoot([
      {
        path: ':carId',
        component: CarComponent,
      },
    ]),
    StoreRouterConnectingModule.forRoot(),
  ],
  declarations: [AppComponent, CarComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
