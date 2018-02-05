import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { share } from 'rxjs/operator/share';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';

import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { LiftedState } from './reducer';
import { applyOperators } from './utils';

export const ExtensionActionTypes = {
  START: 'START',
  DISPATCH: 'DISPATCH',
  STOP: 'STOP',
  ACTION: 'ACTION',
};

export const REDUX_DEVTOOLS_EXTENSION = new InjectionToken<
  ReduxDevtoolsExtension
>('Redux Devtools Extension');

export interface ReduxDevtoolsExtensionConnection {
  subscribe(listener: (change: any) => void): void;
  unsubscribe(): void;
  send(action: any, state: any): void;
  init(state?: any): void;
}

/*
 Hi Brandon please suggest: 
 I think ReduxDevtoolsExtensionConfig interface we may not need. 
 Because already all of these properties are there in our StoreDevToolsConfig interface. 
 Therefore, I just did not use it. If you agree then we can delete this interface. 
 Or we can inherit StoreDevToolsConfig from  ReduxDevtoolsExtensionConfig. 
 Please advice.
 */
export interface ReduxDevtoolsExtensionConfig {
  features?: object | boolean;
  name: string | undefined;
  instanceId: string;
}

export interface ReduxDevtoolsExtension {
  connect(options: StoreDevtoolsConfig): ReduxDevtoolsExtensionConnection;
  send(
    action: any,
    state: any,
    options?: boolean | StoreDevtoolsConfig,
    instanceId?: string
  ): void;
}

@Injectable()
export class DevtoolsExtension {
  private devtoolsExtension: ReduxDevtoolsExtension;
  devToolConnection: ReduxDevtoolsExtensionConnection;

  liftedActions$: Observable<any>;
  actions$: Observable<any>;

  constructor(
    @Inject(REDUX_DEVTOOLS_EXTENSION) devtoolsExtension: ReduxDevtoolsExtension,
    @Inject(STORE_DEVTOOLS_CONFIG)
    private storeDevtoolsConfig: StoreDevtoolsConfig
  ) {
    this.devtoolsExtension = devtoolsExtension;
    this.createActionStreams();
  }

  notify(action: Action, state: LiftedState) {
    if (!this.devtoolsExtension) {
      return;
    }

    // this function call is to get message in devtool monitor
    this.devtoolsExtension.send(
      null,
      state,
      this.storeDevtoolsConfig // instance id is inside config, devtool extension library can read it from config.
    );

    // this function call is required to make sure action/state sanitizer are getting called.
    this.devToolConnection.send(action, state);
  }

  private createChangesObservable(): Observable<any> {
    if (!this.devtoolsExtension) {
      return empty();
    }

    return new Observable(subscriber => {
      this.devToolConnection = this.devtoolsExtension.connect(
        this.storeDevtoolsConfig // passing entire config for future properties which enduser can pass.
      );

      this.devToolConnection.init();

      this.devToolConnection.subscribe((change: any) =>
        subscriber.next(change)
      );

      return this.devToolConnection.unsubscribe;
    });
  }

  private createActionStreams() {
    // Listens to all changes based on our instanceId
    const changes$ = share.call(this.createChangesObservable());

    // Listen for the start action
    const start$ = filter.call(
      changes$,
      (change: any) => change.type === ExtensionActionTypes.START
    );

    // Listen for the stop action
    const stop$ = filter.call(
      changes$,
      (change: any) => change.type === ExtensionActionTypes.STOP
    );

    // Listen for lifted actions
    const liftedActions$ = applyOperators(changes$, [
      [filter, (change: any) => change.type === ExtensionActionTypes.DISPATCH],
      [map, (change: any) => this.unwrapAction(change.payload)],
    ]);

    // Listen for unlifted actions
    const actions$ = applyOperators(changes$, [
      [filter, (change: any) => change.type === ExtensionActionTypes.ACTION],
      [map, (change: any) => this.unwrapAction(change.payload)],
    ]);

    const actionsUntilStop$ = takeUntil.call(actions$, stop$);
    const liftedUntilStop$ = takeUntil.call(liftedActions$, stop$);

    // Only take the action sources between the start/stop events
    this.actions$ = switchMap.call(start$, () => actionsUntilStop$);
    this.liftedActions$ = switchMap.call(start$, () => liftedUntilStop$);
  }

  private unwrapAction(action: Action) {
    return typeof action === 'string' ? eval(`(${action})`) : action;
  }
}
