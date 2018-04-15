import { ActionSanitizer, StateSanitizer } from './config';
import { InjectionToken, Inject, Optional, Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { isArray } from 'util';

export const ACTION_SANITIZER = new InjectionToken<ActionSanitizer>(
  '@ngrx/devtools Action Sanitizer'
);
export const STATE_SANITIZER = new InjectionToken<StateSanitizer>(
  '@ngrx/devtools State Sanitizer'
);

export type Sanitizer<I> = (instance: I, id: number) => I;

export enum LOGGER_TYPE {
  RegisterActionSanitizer = 'registerActionSanitizer',
  RegisterStateSanitizer = 'registerStateSanitizer',
  DeregisterActionSanitizer = 'deregisterActionSanitizer',
  DeregisterStateSanitizer = 'deregisterStateSanitizer',
  SanitizeAction = 'sanitizeAction',
  SanitizeState = 'sanitizeState',
}

export type LoggerFunction = <I>(
  type: LOGGER_TYPE,
  name: string,
  input?: I,
  output?: I,
  id?: number
) => void;

export class DevToolsSanitizerServiceConfig {
  logger?: LoggerFunction;
  loggingEnabled?: boolean;
}

@Injectable()
export class DevToolsSanitizerService {
  actionSanitizers: { [id: string]: ActionSanitizer } = {};
  stateSanitizers: { [id: string]: StateSanitizer } = {};
  config: DevToolsSanitizerServiceConfig;

  constructor(
    @Optional()
    @Inject(ACTION_SANITIZER)
    _actionSanitizers?: ActionSanitizer | ActionSanitizer[],
    @Optional()
    @Inject(STATE_SANITIZER)
    _stateSanitiziers?: StateSanitizer | StateSanitizer[],
    @Optional() _config?: DevToolsSanitizerServiceConfig
  ) {
    this.config = {
      loggingEnabled: false,
    };

    if (_config) {
      this.config = {
        ...this.config,
        ..._config,
      };
    }

    if (this.config.loggingEnabled && !this.config.logger) {
      throw new Error(
        `DevToolsSanitizerService logging is enabled but no logger was provided`
      );
    }

    this.register(this.registerActionSanitizer, _actionSanitizers);
    this.register(this.registerStateSanitizer, _stateSanitiziers);
  }

  registerActionSanitizer(name: string, actionSanitizer: ActionSanitizer) {
    if (this.config.loggingEnabled && this.config.logger) {
      this.config.logger(LOGGER_TYPE.RegisterActionSanitizer, name);
    }
    this.actionSanitizers[name] = actionSanitizer;
  }

  registerStateSanitizer(name: string, stateSanitizers: StateSanitizer) {
    if (this.config.loggingEnabled && this.config.logger) {
      this.config.logger(LOGGER_TYPE.RegisterStateSanitizer, name);
    }
    this.stateSanitizers[name] = stateSanitizers;
  }

  deregisterActionSanitizer(name: string) {
    if (this.config.loggingEnabled && this.config.logger) {
      this.config.logger(LOGGER_TYPE.DeregisterActionSanitizer, name);
    }
    if (this.actionSanitizers.hasOwnProperty(name)) {
      delete this.actionSanitizers[name];
    }
  }

  deregisterStateSanitizer(name: string) {
    if (this.config.loggingEnabled && this.config.logger) {
      this.config.logger(LOGGER_TYPE.DeregisterStateSanitizer, name);
    }
    if (this.stateSanitizers.hasOwnProperty(name)) {
      delete this.stateSanitizers[name];
    }
  }

  sanitizeAction = (action: Action, id: number): Action => {
    return this.cycle(
      this.actionSanitizers,
      action,
      id,
      LOGGER_TYPE.SanitizeAction
    );
  };

  sanitizeState = (state: any, index: number): any => {
    return this.cycle(
      this.stateSanitizers,
      state,
      index,
      LOGGER_TYPE.SanitizeState
    );
  };

  private register(fn: Function, instance: any, index: number = 0) {
    if (instance) {
      if (isArray(instance)) {
        instance.forEach(e => this.register(fn, e, index++));
      } else {
        fn.call(this, `INIT_${index}`, instance);
      }
    }
  }

  private values<T>(obj: { [id: string]: T }) {
    return Object.keys(obj).map(e => ({ key: e, value: obj[e] }));
  }

  private cycle<I>(
    obj: { [id: string]: Sanitizer<I> },
    initial: I,
    id: number,
    type: LOGGER_TYPE
  ): I {
    return this.values(obj).reduce((value, santizier) => {
      const newValue = santizier.value(value, id);

      if (this.config.loggingEnabled && this.config.logger) {
        this.config.logger(type, santizier.key, value, newValue, id);
      }

      return newValue;
    }, initial);
  }
}
