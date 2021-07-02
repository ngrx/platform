import { MemoizedSelector } from '@ngrx/store';

export interface MockSelector {
  selector: string | MemoizedSelector<any, any>;
  value: any;
}
