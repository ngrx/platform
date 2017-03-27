import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Router, RouterModule } from "@angular/router";
import { StoreModule } from '@ngrx/store';
import { ROUTER_NAVIGATION, ROUTER_CANCEL, ROUTER_ERROR, StoreRouterConnectingModule } from "../src/index";

@Component({
  selector: 'test-app',
  template: '<router-outlet></router-outlet>'
})
export class AppCmp { }

@Component({
  selector: 'simple-cmp',
  template: 'simple'
})
export class SimpleCmp { }

export function reducer (state: string = "", action: any) {
  if (action.type === ROUTER_NAVIGATION) {
    return action.payload.routerState.url.toString();
  } else {
    return state;
  }
}

@NgModule({
  declarations: [AppCmp, SimpleCmp],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: SimpleCmp },
      { path: 'next', component: SimpleCmp }
    ]),
    StoreModule.provideStore({ reducer }),
    StoreRouterConnectingModule
  ],
  bootstrap: [AppCmp]
})
export class AppModule {
}