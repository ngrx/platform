import { Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  OnStateInit,
} from '@ngrx/component-store';
import { tap } from 'rxjs';

interface LifeCycle {
  init: boolean;
}

@Injectable()
export class LoginPageStore
  extends ComponentStore<LifeCycle>
  implements OnStoreInit, OnStateInit
{
  constructor() // private readonly service: Service
  {
    super({ init: true });
  }

  logEffect = this.effect(tap<string>(console.log));

  ngrxOnStoreInit() {
    console.log('onInitStore');
    // console.log('service', this.service); // undefined
    console.log('log effect', this.logEffect('one')); // undefined
    // console.log('effect')
  }

  ngrxOnStateInit() {
    console.log('onInitState');
    // console.log('service', this.service); // undefined
    console.log('log effect', this.logEffect('two')); // undefined
  }
}
