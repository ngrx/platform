import { createFeatureSelector } from '@ngrx/store';

export const selectCount = createFeatureSelector<number>('count');
