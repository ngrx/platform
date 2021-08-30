/**
 * Hero-oriented InMemoryDbService with method overrides.
 */
import { Injectable } from '@angular/core';

import {
  RequestInfo,
  RequestInfoUtilities,
  ParsedRequestUrl,
} from 'angular-in-memory-web-api';

import { Hero, Villain } from './model';

/** In-memory database data */
interface Db {
  [collectionName: string]: any[];
}

@Injectable()
export class InMemoryDataService {
  /** True if in-mem service is intercepting; all requests pass thru when false. */
  active = true;
  maxId = 0;

  /** In-memory database data */
  db: Db = {};

  /** Create the in-memory database on start or by command */
  createDb(reqInfo?: RequestInfo) {
    this.db = getDbData();

    if (reqInfo) {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
      if (body.clear === true) {
        // tslint:disable-next-line:forin
        for (const coll in this.db) {
          this.db[coll].length = 0;
        }
      }

      this.active = !!body.active;
    }
    return this.db;
  }

  /**
   * Simulate generating new Id on the server
   * All collections in this db have numeric ids.
   * Seed grows by highest id seen in any of the collections.
   */
  genId(collection: { id: number }[], collectionName: string) {
    this.maxId =
      1 +
      collection.reduce((prev, cur) => Math.max(prev, cur.id || 0), this.maxId);
    return this.maxId;
  }

  /**
   * Override `parseRequestUrl`
   * Manipulates the request URL or the parsed result.
   * If in-mem is inactive, clear collectionName so that service passes request thru.
   * If in-mem is active, after parsing with the default parser,
   * @param url from request URL
   * @param utils for manipulating parsed URL
   */
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const parsed = utils.parseRequestUrl(url);
    const isDefaultRoot = parsed.apiBase === 'api/';
    parsed.collectionName =
      this.active && isDefaultRoot
        ? mapCollectionName(parsed.collectionName)
        : undefined;
    return parsed;
  }
}

/**
 * Remap a known singular collection name ("hero")
 * to the plural collection name ("heroes"); else return the name
 * @param name - collection name from the parsed URL
 */
function mapCollectionName(name: string): string {
  return (
    ({
      hero: 'heroes',
      villain: 'villains',
    } as any)[name] || name
  );
}

/**
 * Development data
 */
function getDbData() {
  const heroes: Hero[] = [
    {
      id: 11,
      name: 'Maxwell Smart',
      saying: 'Missed it by that much.',
    },
    {
      id: 12,
      name: 'Bullwinkle J. Moose',
      saying: 'Watch me pull a rabbit out of a hat.',
    },
    {
      id: 13,
      name: 'Muhammad Ali',
      saying: 'Float like a butterfly, sting like a bee.',
    },
    {
      id: 14,
      name: 'Eleanor Roosevelt',
      saying: 'No one can make you feel inferior without your consent.',
    },
  ];

  const villains: Villain[] = [
    {
      id: 21,
      name: 'Dr. Evil',
      saying: 'One million dollars!',
    },
    {
      id: 22,
      name: 'Agent Smith',
      saying: 'Human beings are a disease.',
    },
    {
      id: 23,
      name: 'Natasha Fatale',
      saying: 'You can say that again, dahling.',
    },
    {
      id: 24,
      name: 'Goldfinger',
      saying: 'No, I expect you to die!',
    },
    {
      id: 25,
      name: 'West Witch',
      saying: "I'll get you, my pretty, and your little dog too!",
    },
    {
      id: 26,
      name: 'Tony Montana',
      saying: 'Say hello to my little friend.',
    },
  ];

  return { heroes, villains } as Db;
}
