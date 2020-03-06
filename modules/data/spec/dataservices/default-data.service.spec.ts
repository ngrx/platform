import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { Update } from '@ngrx/entity';

import {
  DefaultDataService,
  DefaultDataServiceFactory,
  DefaultHttpUrlGenerator,
  HttpUrlGenerator,
  DefaultDataServiceConfig,
  DataServiceError,
} from '../../';

class Hero {
  id!: number;
  name!: string;
  version?: number;
}

////////  Tests  /////////////
describe('DefaultDataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const heroUrl = 'api/hero/';
  const heroesUrl = 'api/heroes/';
  let httpUrlGenerator: HttpUrlGenerator;
  let service: DefaultDataService<Hero>;

  //// HttpClient testing boilerplate
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    httpUrlGenerator = new DefaultHttpUrlGenerator(null as any);
    httpUrlGenerator.registerHttpResourceUrls({
      Hero: {
        entityResourceUrl: heroUrl,
        collectionResourceUrl: heroesUrl,
      },
    });

    service = new DefaultDataService('Hero', httpClient, httpUrlGenerator);
  });

  afterEach(() => {
    // After every test, assert that there are no pending requests.
    httpTestingController.verify();
  });
  ///////////////////

  describe('property inspection', () => {
    // Test wrapper exposes protected properties
    class TestService<T> extends DefaultDataService<T> {
      properties = {
        entityUrl: this.entityUrl,
        entitiesUrl: this.entitiesUrl,
        getDelay: this.getDelay,
        saveDelay: this.saveDelay,
        timeout: this.timeout,
      };
    }

    // tslint:disable-next-line:no-shadowed-variable
    let service: TestService<Hero>;

    beforeEach(() => {
      // use test wrapper class to get to protected properties
      service = new TestService('Hero', httpClient, httpUrlGenerator);
    });

    it('has expected name', () => {
      expect(service.name).toBe('Hero DefaultDataService');
    });

    it('has expected single-entity url', () => {
      expect(service.properties.entityUrl).toBe(heroUrl);
    });

    it('has expected multiple-entities url', () => {
      expect(service.properties.entitiesUrl).toBe(heroesUrl);
    });
  });

  describe('#getAll', () => {
    let expectedHeroes: Hero[];

    beforeEach(() => {
      expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] as Hero[];
    });

    it('should return expected heroes (called once)', () => {
      service
        .getAll()
        .subscribe(
          heroes =>
            expect(heroes).toEqual(
              expectedHeroes,
              'should return expected heroes'
            ),
          fail
        );

      // HeroService should have made one request to GET heroes from expected URL
      const req = httpTestingController.expectOne(heroesUrl);
      expect(req.request.method).toEqual('GET');

      expect(req.request.body).toBeNull();

      // Respond with the mock heroes
      req.flush(expectedHeroes);
    });

    it('should be OK returning no heroes', () => {
      service
        .getAll()
        .subscribe(
          heroes =>
            expect(heroes.length).toEqual(0, 'should have empty heroes array'),
          fail
        );

      const req = httpTestingController.expectOne(heroesUrl);
      req.flush([]); // Respond with no heroes
    });

    it('should return expected heroes (called multiple times)', () => {
      service.getAll().subscribe();
      service.getAll().subscribe();
      service
        .getAll()
        .subscribe(
          heroes =>
            expect(heroes).toEqual(
              expectedHeroes,
              'should return expected heroes'
            ),
          fail
        );

      const requests = httpTestingController.match(heroesUrl);
      expect(requests.length).toEqual(3, 'calls to getAll()');

      // Respond to each request with different mock hero results
      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'bob' }]);
      requests[2].flush(expectedHeroes);
    });

    it('should turn 404 into Observable<DataServiceError>', () => {
      const msg = 'deliberate 404 error';

      service.getAll().subscribe(
        heroes => fail('getAll succeeded when expected it to fail with a 404'),
        err => {
          expect(err).toBeDefined();
          expect(err instanceof DataServiceError).toBe(
            true,
            'is DataServiceError'
          );
          expect(err.error.status).toEqual(404, 'has 404 status');
          expect(err.message).toEqual(msg, 'has expected error message');
        }
      );

      const req = httpTestingController.expectOne(heroesUrl);

      const errorEvent = {
        // Source of the service's not-so-friendly user-facing message
        message: msg,

        // The rest of this is optional and not used. Just showing that you could.
        filename: 'DefaultDataService.ts',
        lineno: 42,
        colno: 21,
      } as ErrorEvent;

      req.error(errorEvent, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#getById', () => {
    let expectedHero: Hero;
    const heroUrlId1 = heroUrl + '1';

    it('should return expected hero when id is found', () => {
      expectedHero = { id: 1, name: 'A' };

      service
        .getById(1)
        .subscribe(
          hero =>
            expect(hero).toEqual(expectedHero, 'should return expected hero'),
          fail
        );

      // One request to GET hero from expected URL
      const req = httpTestingController.expectOne(heroUrlId1);

      expect(req.request.body).toBeNull();

      // Respond with the expected hero
      req.flush(expectedHero);
    });

    it('should turn 404 when id not found', () => {
      service.getById(1).subscribe(
        heroes => fail('getById succeeded when expected it to fail with a 404'),
        err => {
          expect(err instanceof DataServiceError).toBe(true);
        }
      );

      const req = httpTestingController.expectOne(heroUrlId1);
      const errorEvent = { message: 'boom!' } as ErrorEvent;
      req.error(errorEvent, { status: 404, statusText: 'Not Found' });
    });

    it('should throw when no id given', () => {
      service.getById(undefined as any).subscribe(
        heroes => fail('getById succeeded when expected it to fail'),
        err => {
          expect(err.error).toMatch(/No "Hero" key/);
        }
      );
    });
  });

  describe('#getWithQuery', () => {
    let expectedHeroes: Hero[];

    beforeEach(() => {
      expectedHeroes = [{ id: 1, name: 'BA' }, { id: 2, name: 'BB' }] as Hero[];
    });

    it('should return expected selected heroes w/ object params', () => {
      service
        .getWithQuery({ name: 'B' })
        .subscribe(
          heroes =>
            expect(heroes).toEqual(
              expectedHeroes,
              'should return expected heroes'
            ),
          fail
        );

      // HeroService should have made one request to GET heroes
      // from expected URL with query params
      const req = httpTestingController.expectOne(heroesUrl + '?name=B');
      expect(req.request.method).toEqual('GET');

      expect(req.request.body).toBeNull();

      // Respond with the mock heroes
      req.flush(expectedHeroes);
    });

    it('should return expected selected heroes w/ string params', () => {
      service
        .getWithQuery('name=B')
        .subscribe(
          heroes =>
            expect(heroes).toEqual(
              expectedHeroes,
              'should return expected heroes'
            ),
          fail
        );

      // HeroService should have made one request to GET heroes
      // from expected URL with query params
      const req = httpTestingController.expectOne(heroesUrl + '?name=B');
      expect(req.request.method).toEqual('GET');

      // Respond with the mock heroes
      req.flush(expectedHeroes);
    });

    it('should be OK returning no heroes', () => {
      service
        .getWithQuery({ name: 'B' })
        .subscribe(
          heroes =>
            expect(heroes.length).toEqual(0, 'should have empty heroes array'),
          fail
        );

      const req = httpTestingController.expectOne(heroesUrl + '?name=B');
      req.flush([]); // Respond with no heroes
    });

    it('should turn 404 into Observable<DataServiceError>', () => {
      const msg = 'deliberate 404 error';

      service.getWithQuery({ name: 'B' }).subscribe(
        heroes =>
          fail('getWithQuery succeeded when expected it to fail with a 404'),
        err => {
          expect(err).toBeDefined();
          expect(err instanceof DataServiceError).toBe(
            true,
            'is DataServiceError'
          );
          expect(err.error.status).toEqual(404, 'has 404 status');
          expect(err.message).toEqual(msg, 'has expected error message');
        }
      );

      const req = httpTestingController.expectOne(heroesUrl + '?name=B');

      const errorEvent = { message: msg } as ErrorEvent;

      req.error(errorEvent, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#add', () => {
    let expectedHero: Hero;

    it('should return expected hero with id', () => {
      expectedHero = { id: 42, name: 'A' };
      const heroData: Hero = { id: undefined, name: 'A' } as any;

      service
        .add(heroData)
        .subscribe(
          hero =>
            expect(hero).toEqual(expectedHero, 'should return expected hero'),
          fail
        );

      // One request to POST hero from expected URL
      const req = httpTestingController.expectOne(
        r => r.method === 'POST' && r.url === heroUrl
      );

      expect(req.request.body).toEqual(heroData, 'should send entity data');

      // Respond with the expected hero
      req.flush(expectedHero);
    });

    it('should throw when no entity given', () => {
      service.add(undefined as any).subscribe(
        heroes => fail('add succeeded when expected it to fail'),
        err => {
          expect(err.error).toMatch(/No "Hero" entity/);
        }
      );
    });
  });

  describe('#delete', () => {
    const heroUrlId1 = heroUrl + '1';

    it('should delete by hero id', () => {
      service
        .delete(1)
        .subscribe(
          result =>
            expect(result).toEqual(1, 'should return the deleted entity id'),
          fail
        );

      // One request to DELETE hero from expected URL
      const req = httpTestingController.expectOne(
        r => r.method === 'DELETE' && r.url === heroUrlId1
      );

      expect(req.request.body).toBeNull();

      // Respond with empty nonsense object
      req.flush({});
    });

    it('should return successfully when id not found and delete404OK is true (default)', () => {
      service
        .delete(1)
        .subscribe(
          result =>
            expect(result).toEqual(1, 'should return the deleted entity id'),
          fail
        );

      // One request to DELETE hero from expected URL
      const req = httpTestingController.expectOne(
        r => r.method === 'DELETE' && r.url === heroUrlId1
      );

      // Respond with empty nonsense object
      req.flush({});
    });

    it('should return 404 when id not found and delete404OK is false', () => {
      service = new DefaultDataService('Hero', httpClient, httpUrlGenerator, {
        delete404OK: false,
      });
      service.delete(1).subscribe(
        heroes => fail('delete succeeded when expected it to fail with a 404'),
        err => {
          expect(err instanceof DataServiceError).toBe(true);
        }
      );

      const req = httpTestingController.expectOne(heroUrlId1);
      const errorEvent = { message: 'boom!' } as ErrorEvent;
      req.error(errorEvent, { status: 404, statusText: 'Not Found' });
    });

    it('should throw when no id given', () => {
      service.delete(undefined as any).subscribe(
        heroes => fail('delete succeeded when expected it to fail'),
        err => {
          expect(err.error).toMatch(/No "Hero" key/);
        }
      );
    });
  });

  describe('#update', () => {
    const heroUrlId1 = heroUrl + '1';

    it('should return expected hero with id', () => {
      // Call service.update with an Update<T> arg
      const updateArg: Update<Hero> = {
        id: 1,
        changes: { id: 1, name: 'B' },
      };

      // The server makes the update AND updates the version concurrency property.
      const expectedHero: Hero = { id: 1, name: 'B', version: 2 };

      service
        .update(updateArg)
        .subscribe(
          updated =>
            expect(updated).toEqual(
              expectedHero,
              'should return the expected hero'
            ),
          fail
        );

      // One request to PUT hero from expected URL
      const req = httpTestingController.expectOne(
        r => r.method === 'PUT' && r.url === heroUrlId1
      );

      expect(req.request.body).toEqual(
        updateArg.changes,
        'should send update entity data'
      );

      // Respond with the expected hero
      req.flush(expectedHero);
    });

    it('should return 404 when id not found', () => {
      service.update({ id: 1, changes: { id: 1, name: 'B' } }).subscribe(
        update => fail('update succeeded when expected it to fail with a 404'),
        err => {
          expect(err instanceof DataServiceError).toBe(true);
        }
      );

      const req = httpTestingController.expectOne(heroUrlId1);
      const errorEvent = { message: 'boom!' } as ErrorEvent;
      req.error(errorEvent, { status: 404, statusText: 'Not Found' });
    });

    it('should throw when no update given', () => {
      service.update(undefined as any).subscribe(
        heroes => fail('update succeeded when expected it to fail'),
        err => {
          expect(err.error).toMatch(/No "Hero" update data/);
        }
      );
    });
  });

  describe('#upsert', () => {
    let expectedHero: Hero;

    it('should return expected hero with id', () => {
      expectedHero = { id: 42, name: 'A' };
      const heroData: Hero = { id: undefined, name: 'A' } as any;

      service
        .upsert(heroData)
        .subscribe(
          hero =>
            expect(hero).toEqual(expectedHero, 'should return expected hero'),
          fail
        );

      // One request to POST hero from expected URL
      const req = httpTestingController.expectOne(
        r => r.method === 'POST' && r.url === heroUrl
      );

      expect(req.request.body).toEqual(heroData, 'should send entity data');

      // Respond with the expected hero
      req.flush(expectedHero);
    });

    it('should throw when no entity given', () => {
      service.upsert(undefined as any).subscribe(
        heroes => fail('add succeeded when expected it to fail'),
        err => {
          expect(err.error).toMatch(/No "Hero" entity/);
        }
      );
    });
  });
});

describe('DefaultDataServiceFactory', () => {
  const heroUrl = 'api/hero';
  const heroesUrl = 'api/heroes';

  let http: any;
  let httpUrlGenerator: HttpUrlGenerator;

  beforeEach(() => {
    httpUrlGenerator = new DefaultHttpUrlGenerator(null as any);
    httpUrlGenerator.registerHttpResourceUrls({
      Hero: {
        entityResourceUrl: heroUrl,
        collectionResourceUrl: heroesUrl,
      },
    });
    http = {
      get: jasmine.createSpy('get'),
      delete: jasmine.createSpy('delete'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    http.get.and.returnValue(of([]));
  });

  describe('(no config)', () => {
    it('can create factory', () => {
      const factory = new DefaultDataServiceFactory(http, httpUrlGenerator);
      const heroDS = factory.create<Hero>('Hero');
      expect(heroDS.name).toBe('Hero DefaultDataService');
    });

    it('should produce hero data service that gets all heroes with expected URL', () => {
      const factory = new DefaultDataServiceFactory(http, httpUrlGenerator);
      const heroDS = factory.create<Hero>('Hero');
      heroDS.getAll();
      expect(http.get).toHaveBeenCalledWith('api/heroes', undefined);
    });
  });

  describe('(with config)', () => {
    it('can create factory', () => {
      const config: DefaultDataServiceConfig = { root: 'api' };
      const factory = new DefaultDataServiceFactory(
        http,
        httpUrlGenerator,
        config
      );
      const heroDS = factory.create<Hero>('Hero');
      expect(heroDS.name).toBe('Hero DefaultDataService');
    });

    it('should produce hero data service that gets heroes via hero HttpResourceUrls', () => {
      const newHeroesUrl = 'some/other/api/heroes';
      const config: DefaultDataServiceConfig = {
        root: 'api',
        entityHttpResourceUrls: {
          Hero: {
            entityResourceUrl: heroUrl,
            collectionResourceUrl: newHeroesUrl,
          },
        },
      };
      const factory = new DefaultDataServiceFactory(
        http,
        httpUrlGenerator,
        config
      );
      const heroDS = factory.create<Hero>('Hero');
      heroDS.getAll();
      expect(http.get).toHaveBeenCalledWith(newHeroesUrl, undefined);
    });
  });
});
