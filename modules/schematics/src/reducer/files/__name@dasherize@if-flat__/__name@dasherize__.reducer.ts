import { Action } from '@ngrx/store';
<% if(feature) { %>import { <%= classify(name) %>Actions, <%= classify(name) %>ActionTypes } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>

export interface State {
  data: any[];
  loading: boolean;
  error: any;
}

export const initialState: State = {
  data: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: <% if(feature) { %><%= classify(name) %>Actions<% } else { %>Action<% } %>): State {
  switch (action.type) {
<% if(feature) { %>
    case <%= classify(name) %>ActionTypes.Load<%= classify(name) %>s:
      return { ...state, loading: true, error: null };

    case <%= classify(name) %>ActionTypes.Load<%= classify(name) %>sSuccess:
      return { ...state, data: action.payload.data, loading: false, error: null, };

    case <%= classify(name) %>ActionTypes.Load<%= classify(name) %>sFailure:
      return { ...state, loading: false, error: action.payload.error };

<% } %>
    default:
      return state;
  }
}
