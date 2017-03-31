import { TestBed, inject } from '@angular/core/testing';
import * as DB from '../src/database';
import 'rxjs/add/operator/toArray';


const todoAppSchema: DB.DBSchema = {
  version: 1,
  name: 'todo_app',
  stores: {
    'todos': {autoIncrement: true},
    'categories': {autoIncrement: true},
    'friends': {autoIncrement: true},
    'users': {autoIncrement: true, primaryKey: 'userID'}
  }
};


// cleanup function
const deleteDatabase = (done: any) => {

  let del = indexedDB.deleteDatabase(todoAppSchema.name);

  del.onerror = (err) => {
    (<any>del).onblocked = undefined;
    console.error(err);
    throw err;
  };
  del.onsuccess = () => {
    done();
  };
};

describe('database functionality', () => {

  let idb: DB.Database;
  let dbBackend: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DB.DBModule.provideDB(todoAppSchema)
      ]
    })
  });

  beforeEach(inject([ DB.Database ], (_idb: DB.Database) => {
    idb = _idb;
  }))

  beforeAll((done) => {
    deleteDatabase(done);
  });

  it('should instantiate a DB', () => {
    expect(idb).toBeDefined();
  });

  it('should open successfully', (done) => {
    let openReq = idb.open(todoAppSchema.name);

    openReq.subscribe(db => {
      expect(db).toBeDefined();
      expect(db.objectStoreNames.length).toBe(4);
      done();
    });
  });

  it('should insert some data', (done) => {
    idb.insert('todos', [{name: 'todo1'}, {name: 'todo2'}])
      .toArray()
      .subscribe((results: any) => {
        expect(results[0]).toEqual({$key: 1, name: 'todo1'});
        expect(results[1]).toEqual({$key: 2, name: 'todo2'});
        done();
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      });
  });

  it('should insert some more data', (done) => {
    idb.insert('todos', [{name: 'todo3'}, {name: 'todo4'}])
      .toArray()
      .subscribe((results: any) => {
        expect(results[0]).toEqual({$key: 3, name: 'todo3'});
        expect(results[1]).toEqual({$key: 4, name: 'todo4'});
        done();
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      });
  });

  it('should update existing data', (done) => {
    idb.insert('todos', [{$key: 3, name: 'todo3++'}, {$key: 4, name: 'todo4++'}])
      .toArray()
      .subscribe((results: any) => {
        expect(results[0]).toEqual({$key: 3, name: 'todo3++'});
        expect(results[1]).toEqual({$key: 4, name: 'todo4++'});
        done();
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      });
  });

  it('should insert some more data with a primary key', (done) => {
    idb.insert('users', [{userID: 'user1'}, {userID: 'user2'}])
      .toArray()
      .subscribe((results: any) => {
        expect(results[0]).toEqual({userID: 'user1'});
        expect(results[1]).toEqual({userID: 'user2'});
        done();
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      });
  });

  it('should broadcast notifications on insert', (done) => {

    let notificationCount = 0;

    idb.changes.subscribe(notif => {
      notificationCount++;
    });
    idb.insert('todos', [{name: 'todo5'}, {name: 'todo6'}])
      .toArray()
      .subscribe(() => {}, () => {}, () => {
        expect(notificationCount).toBe(2);
        done();
      });
  });

  it('should get a record by key', (done) => {
    let found: any;
    idb.get('todos', 2)
      .subscribe((record: any) => {
        found = record;
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      }, () => {
        expect(found).toEqual({name: 'todo2'});
        done();
      });
  });

  it('should get a record by primaryKey', (done) => {
    let found: any;
    idb.get('users', 'user1')
      .subscribe((record: any) => {
        found = record;
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      }, () => {
        expect(found).toEqual({userID: 'user1'});
        done();
      });
  });

  it('should iterate records', (done) => {
    let found: any;
    idb.query('todos').toArray()
      .subscribe((records: any) => {
        found = records;
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      }, () => {
        expect(found.length).toEqual(6);
        done();
      });
  });

  it('should iterate records with a predicate fn', (done) => {
    let found: any;
    idb.query('todos', (rec) => rec.name === 'todo5').toArray()
      .subscribe((records: any) => {
        found = records;
      }, (err: any) => {
        console.error(err);
        done.fail(err);
      }, () => {
        expect(found.length).toEqual(1);
        done();
      });
  });

});
