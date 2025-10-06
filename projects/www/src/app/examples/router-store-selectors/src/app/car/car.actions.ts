import { createAction, props } from '@ngrx/store';
import { Car } from './car.reducer';

// for our example, we'll only populate cars in the store on app init
export const appInit = createAction('[App] Init', props<{ cars: Car[] }>());
