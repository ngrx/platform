import { Injectable, NgModule, Optional } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Update } from '@ngrx/entity';

import {
  DefaultDataService,
  DefaultDataServiceFactory,
  HttpUrlGenerator,
  EntityHttpResourceUrls,
  EntityDataService,
  EntityCollectionDataService,
  QueryParams,
} from '../../';

// region Test Helpers
///// Test Helpers /////

export class CustomDataService {
  name: string;
  constructor(name: string) {
    this.name = name + ' CustomDataService';
  }
}

export class Bazinga {
  id!: number;
  wow!: string;
}

@Injectable()
export class BazingaDataService
  implements EntityCollectionDataService<Bazinga> {
  name: string;

  // TestBed bug requires `@Optional` even though http is always provided.
  constructor(@Optional() private http: HttpClient) {
    if (!http) {
      throw new Error('Where is HttpClient?');
    }
    this.name = 'Bazinga custom data service';
  }

  add(entity: Bazinga): Observable<Bazinga> {
    return this.bazinga();
  }
  delete(id: any): Observable<number | string> {
    return this.bazinga();
  }
  getAll(): Observable<Bazinga[]> {
    return this.bazinga();
  }
  getById(id: any): Observable<Bazinga> {
    return this.bazinga();
  }
  getWithQuery(params: string | QueryParams): Observable<Bazinga[]> {
    return this.bazinga();
  }
  update(update: Update<Bazinga>): Observable<Bazinga> {
    return this.bazinga();
  }
  upsert(entity: Bazinga): Observable<Bazinga> {
    return this.bazinga();
  }

  private bazinga(): any {
    bazingaFail();
    return undefined;
  }
}

@NgModule({
  providers: [BazingaDataService],
})
export class CustomDataServiceModule {
  constructor(
    entityDataService: EntityDataService,
    bazingaService: BazingaDataService
  ) {
    entityDataService.registerService('Bazinga', bazingaService);
  }
}

function bazingaFail() {
  throw new Error('Bazinga! This method is not implemented.');
}

/** Test version always returns canned Hero resource base URLs  */
class TestHttpUrlGenerator implements HttpUrlGenerator {
  entityResource(entityName: string, root: string): string {
    return 'api/hero/';
  }
  collectionResource(entityName: string, root: string): string {
    return 'api/heroes/';
  }
  registerHttpResourceUrls(
    entityHttpResourceUrls: EntityHttpResourceUrls
  ): void {}
}

// endregion

///// Tests begin ////
describe('EntityDataService', () => {
  const nullHttp = {};
  let entityDataService: EntityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomDataServiceModule],
      providers: [
        DefaultDataServiceFactory,
        EntityDataService,
        { provide: HttpClient, useValue: nullHttp },
        { provide: HttpUrlGenerator, useClass: TestHttpUrlGenerator },
      ],
    });
    entityDataService = TestBed.inject(EntityDataService);
  });

  describe('#getService', () => {
    it('can create a data service for "Hero" entity', () => {
      const service = entityDataService.getService('Hero');
      expect(service).toBeDefined();
    });

    it('data service should be a DefaultDataService by default', () => {
      const service = entityDataService.getService('Hero');
      expect(service instanceof DefaultDataService).toBe(true);
    });

    it('gets the same service every time you ask for it', () => {
      const service1 = entityDataService.getService('Hero');
      const service2 = entityDataService.getService('Hero');
      expect(service1).toBe(service2);
    });
  });

  describe('#register...', () => {
    it('can register a custom service for "Hero"', () => {
      const customService: any = new CustomDataService('Hero');
      entityDataService.registerService('Hero', customService);

      const service = entityDataService.getService('Hero');
      expect(service).toBe(customService);
    });

    it('can register multiple custom services at the same time', () => {
      const customHeroService: any = new CustomDataService('Hero');
      const customVillainService: any = new CustomDataService('Villain');
      entityDataService.registerServices({
        Hero: customHeroService,
        Villain: customVillainService,
      });

      let service = entityDataService.getService('Hero');
      expect(service).toBe(customHeroService);
      expect(service.name).toBe('Hero CustomDataService');

      service = entityDataService.getService('Villain');
      expect(service).toBe(customVillainService);

      // Other services are still DefaultDataServices
      service = entityDataService.getService('Foo');
      expect(service.name).toBe('Foo DefaultDataService');
    });

    it('can register a custom service using a module import', () => {
      const service = entityDataService.getService('Bazinga');
      expect(service instanceof BazingaDataService).toBe(true);
    });
  });
});
