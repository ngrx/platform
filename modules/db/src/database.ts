import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { map } from 'rxjs/operator/map';
import { _do } from 'rxjs/operator/do';
import { from } from 'rxjs/observable/from';
import { OpaqueToken, Inject, Injectable, NgModule, ModuleWithProviders } from '@angular/core';


const IDB_SUCCESS = 'success';
const IDB_COMPLETE = 'complete';
const IDB_ERROR = 'error';
const IDB_UPGRADE_NEEDED = 'upgradeneeded';

const IDB_TXN_READ = 'readonly';
const IDB_TXN_READWRITE = 'readwrite';

export const DB_INSERT = 'DB_INSERT';

export const DatabaseBackend = new OpaqueToken('IndexedDBBackend');
export const IDB_SCHEMA = new OpaqueToken('IDB_SCHEMA');

export interface DBUpgradeHandler {
  (db: IDBDatabase): void;
}

export interface DBStore {
  primaryKey?: string;
  autoIncrement?: boolean;
}

export interface DBSchema {
  version: number;
  name: string;
  stores: {[storename: string]: DBStore};
}

export function getIDBFactory(): IDBFactory {
  return typeof window !== 'undefined' ? window.indexedDB : self.indexedDB;
}

@Injectable()
export class Database {

  public changes: Subject<any> = new Subject();

  private _idb: IDBFactory;
  private _schema: DBSchema;

  constructor(@Inject(DatabaseBackend) idbBackend: any, @Inject(IDB_SCHEMA) schema: any) {
    this._schema = schema;
    this._idb = idbBackend;
  }

  private _mapRecord(objectSchema: DBStore) {
    return (dbResponseRec: any) => {
      if (!objectSchema.primaryKey) {
        dbResponseRec.record['$key'] = dbResponseRec['$key'];
      }
      return dbResponseRec.record;
    };
  }

  private _upgradeDB(observer: Observer<IDBDatabase>, db: IDBDatabase) {
    for (let storeName in this._schema.stores) {
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }
      this._createObjectStore(db, storeName, this._schema.stores[storeName]);
    }
    observer.next(db);
    observer.complete();
  }

  private _createObjectStore(db: IDBDatabase, key: string, schema: DBStore) {
    let objectStore = db.createObjectStore(key, {autoIncrement: true, keyPath: schema.primaryKey});
  }

  open(dbName: string, version: number = 1, upgradeHandler?: DBUpgradeHandler): Observable<IDBDatabase> {
    const idb = this._idb;
    return Observable.create((observer: Observer<any>) => {

      const openReq = idb.open(dbName, this._schema.version);

      const onSuccess = (event: any) => {
        observer.next(event.target.result);
        observer.complete();
      };
      const onError = (err: any) => {
        console.log(err);
        observer.error(err);
      };

      const onUpgradeNeeded = (event: any) => {
        this._upgradeDB(observer, event.target.result);
      };

      openReq.addEventListener(IDB_SUCCESS, onSuccess);
      openReq.addEventListener(IDB_ERROR, onError);
      openReq.addEventListener(IDB_UPGRADE_NEEDED, onUpgradeNeeded);

      return () => {
        openReq.removeEventListener(IDB_SUCCESS, onSuccess);
        openReq.removeEventListener(IDB_ERROR, onError);
        openReq.removeEventListener(IDB_UPGRADE_NEEDED, onUpgradeNeeded);
      };

    });
  }

  deleteDatabase(dbName: string): Observable<any> {
    return new Observable((deletionObserver: Observer<any>) => {

      const deleteRequest = this._idb.deleteDatabase(dbName);

      const onSuccess = (event: any) => {
        deletionObserver.next(null);
        deletionObserver.complete();
      };

      const onError = (err: any) => deletionObserver.error(err);

      deleteRequest.addEventListener(IDB_SUCCESS, onSuccess);
      deleteRequest.addEventListener(IDB_ERROR, onError);

      return () => {
        deleteRequest.removeEventListener(IDB_SUCCESS, onSuccess);
        deleteRequest.removeEventListener(IDB_ERROR, onError);
      };
    });
  }

  insert(storeName: string, records: any[], notify: boolean = true): Observable<any> {
    const write$ = this.executeWrite(storeName, 'put', records);

    return _do.call(write$, (payload: any) => notify ? this.changes.next({type: DB_INSERT, payload }) : ({}));
  }

  get(storeName: string, key: any): Observable<any> {
    const open$ =  this.open(this._schema.name);

    return mergeMap.call(open$, (db: IDBDatabase) => {
        return new Observable((txnObserver: Observer<any>) => {
         const recordSchema = this._schema.stores[storeName];
         const mapper = this._mapRecord(recordSchema);
         const txn = db.transaction([storeName], IDB_TXN_READ);
         const objectStore = txn.objectStore(storeName);

         const getRequest = objectStore.get(key);

         const onTxnError = (err: any) => txnObserver.error(err);
         const onTxnComplete = () => txnObserver.complete();
         const onRecordFound = (ev: any) => txnObserver.next(getRequest.result);

         txn.addEventListener(IDB_COMPLETE, onTxnComplete);
         txn.addEventListener(IDB_ERROR, onTxnError);

         getRequest.addEventListener(IDB_SUCCESS, onRecordFound);
         getRequest.addEventListener(IDB_ERROR, onTxnError);

         return () => {
           getRequest.removeEventListener(IDB_SUCCESS, onRecordFound);
           getRequest.removeEventListener(IDB_ERROR, onTxnError);
           txn.removeEventListener(IDB_COMPLETE, onTxnComplete);
           txn.removeEventListener(IDB_ERROR, onTxnError);
         };

        });
      });
  }

  query(storeName: string, predicate?: (rec: any) => boolean): Observable<any> {
    const open$ = this.open(this._schema.name);

    return mergeMap.call(open$, (db: IDBDatabase) => {
        return new Observable((txnObserver: Observer<any>) => {
         const txn = db.transaction([storeName], IDB_TXN_READ);
         const objectStore = txn.objectStore(storeName);

         const getRequest = objectStore.openCursor();

         const onTxnError = (err: any) => txnObserver.error(err);
         const onRecordFound = (ev: any) => {
           let cursor = ev.target.result;
           if (cursor) {
             if (predicate) {
               const match = predicate(cursor.value);
               if (match) {
                 txnObserver.next(cursor.value);
               }
             }
             else {
               txnObserver.next(cursor.value);
             }
             cursor.continue();
           }
           else {
             txnObserver.complete();
           }
         };

         txn.addEventListener(IDB_ERROR, onTxnError);

         getRequest.addEventListener(IDB_SUCCESS, onRecordFound);
         getRequest.addEventListener(IDB_ERROR, onTxnError);

         return () => {
           getRequest.removeEventListener(IDB_SUCCESS, onRecordFound);
           getRequest.removeEventListener(IDB_ERROR, onTxnError);
           txn.removeEventListener(IDB_ERROR, onTxnError);
         };

        });
      });
  }

  executeWrite(storeName: string, actionType: string, records: any[]): Observable<any> {
    const changes = this.changes;
    const open$ = this.open(this._schema.name);

    return mergeMap.call(open$, (db: IDBDatabase) => {
        return new Observable((txnObserver: Observer<any>) => {
          const recordSchema = this._schema.stores[storeName];
          const mapper = this._mapRecord(recordSchema);
          const txn = db.transaction([storeName], IDB_TXN_READWRITE);
          const objectStore: any = txn.objectStore(storeName);

          const onTxnError = (err: any) => txnObserver.error(err);
          const onTxnComplete = () => txnObserver.complete();

          txn.addEventListener(IDB_COMPLETE, onTxnComplete);
          txn.addEventListener(IDB_ERROR, onTxnError);

          const makeRequest = (record: any) => {
            return new Observable((reqObserver: Observer<any>) => {
              let req: any;
              if (recordSchema.primaryKey) {
                req = objectStore[actionType](record);
              }
              else {
                let $key = record['$key'];
                let $record = (Object as any).assign({}, record);
                delete $record.key;
                req = objectStore[actionType]($record, $key);
              }
              req.addEventListener(IDB_SUCCESS, () => {
                let $key = req.result;
                reqObserver.next(mapper({$key, record}));
              });
              req.addEventListener(IDB_ERROR, (err: any) => {
                reqObserver.error(err);
              });
            });
          };

          let requestSubscriber = mergeMap.call(from(records), makeRequest)
            .subscribe(txnObserver);

          return () => {
            requestSubscriber.unsubscribe();
            txn.removeEventListener(IDB_COMPLETE, onTxnComplete);
            txn.removeEventListener(IDB_ERROR, onTxnError);
          };
        });
      });
  }

  compare(a: any, b: any): number {
    return this._idb.cmp(a, b);
  }
}


@NgModule({
  providers: [
    Database,
    { provide: DatabaseBackend, useFactory: getIDBFactory }
  ]
})
export class DBModule {
  static provideDB(schema: DBSchema): ModuleWithProviders {
    return {
      ngModule: DBModule,
      providers: [
        { provide: IDB_SCHEMA, useValue: schema }
      ]
    };
  }
}