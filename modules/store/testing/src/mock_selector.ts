import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';

export interface MockSelector {
  selector:
    | string
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>;
  value: any;
}
