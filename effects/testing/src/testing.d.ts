import { Provider } from '@angular/core';
import { Observable } from 'rxjs/Observable';
export declare function provideMockActions(source: Observable<any>): Provider;
export declare function provideMockActions(factory: () => Observable<any>): Provider;
