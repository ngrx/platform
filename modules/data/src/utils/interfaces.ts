import { InjectionToken } from '@angular/core';

export abstract class Logger {
  abstract error(message?: any, ...optionalParams: any[]): void;
  abstract log(message?: any, ...optionalParams: any[]): void;
  abstract warn(message?: any, ...optionalParams: any[]): void;
}

/**
 * Mapping of entity type name to its plural
 */
export interface EntityPluralNames {
  [entityName: string]: string;
}

export const PLURAL_NAMES_TOKEN = new InjectionToken<EntityPluralNames>(
  '@ngrx/data Plural Names'
);

export abstract class Pluralizer {
  abstract pluralize(name: string): string;
}
