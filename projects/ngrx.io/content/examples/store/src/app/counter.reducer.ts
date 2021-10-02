// #docregion
import { createReducer, on, createFeature } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';

export const initialState = 0;

export const counterFeature = createFeature({
  name: 'count',
  reducer: createReducer(
    initialState,
    on(increment, (state) => state + 1),
    on(decrement, (state) => state - 1),
    on(reset, (state) => 0)
  ),
});
