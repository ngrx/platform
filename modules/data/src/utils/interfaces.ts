import { InjectionToken } from '@angular/core';

/**
 * @public
 */
export abstract class Logger {
  abstract error(message?: any, ...optionalParams: any[]): void;
  abstract log(message?: any, ...optionalParams: any[]): void;
  abstract warn(message?: any, ...optionalParams: any[]): void;
}

/**
 * Mapping of entity type name to its plural
 *
 * @public
 */
export interface EntityPluralNames {
  [entityName: string]: string;
}

/**
 * @public
 */
export const PLURAL_NAMES_TOKEN = new InjectionToken<EntityPluralNames>(
  '@ngrx/data Plural Names'
);

/**
 * @public
 */
export abstract class Pluralizer {
  abstract pluralize(name: string): string;
}
