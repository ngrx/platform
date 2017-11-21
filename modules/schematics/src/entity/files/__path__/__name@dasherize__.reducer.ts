import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { <%= classify(name) %> } from './<%= dasherize(name) %>.model';
import { <%= classify(name) %>Actions, <%= classify(name) %>ActionTypes } from './<%= dasherize(name) %>.actions';

export interface State extends EntityState<<%= classify(name) %>> {
  // additional entities state properties
}

export const adapter: EntityAdapter<<%= classify(name) %>> = createEntityAdapter<<%= classify(name) %>>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: <%= classify(name) %>Actions
): State {
  switch (action.type) {
    case <%= classify(name) %>ActionTypes.Add<%= classify(name) %>: {
      return adapter.addOne(action.payload.<%= lowercase(classify(name)) %>, state);
    }

    case <%= classify(name) %>ActionTypes.Add<%= classify(name) %>s: {
      return adapter.addMany(action.payload.<%= lowercase(classify(name)) %>s, state);
    }

    case <%= classify(name) %>ActionTypes.Update<%= classify(name) %>: {
      return adapter.updateOne(action.payload.<%= lowercase(classify(name)) %>, state);
    }

    case <%= classify(name) %>ActionTypes.Update<%= classify(name) %>s: {
      return adapter.updateMany(action.payload.<%= lowercase(classify(name)) %>s, state);
    }

    case <%= classify(name) %>ActionTypes.Delete<%= classify(name) %>: {
      return adapter.removeOne(action.payload.id, state);
    }

    case <%= classify(name) %>ActionTypes.Delete<%= classify(name) %>s: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case <%= classify(name) %>ActionTypes.Load<%= classify(name) %>s: {
      return adapter.addAll(action.payload.<%= lowercase(classify(name)) %>s, state);
    }

    case <%= classify(name) %>ActionTypes.Clear<%= classify(name) %>s: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
