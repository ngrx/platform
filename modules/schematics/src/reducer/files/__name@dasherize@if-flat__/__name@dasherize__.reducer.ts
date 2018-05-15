import { Action } from '@ngrx/store';
<% if(feature) { %>import { <%= classify(name) %>Actions, <%= classify(name) %>ActionTypes } from '<%= featurePath(group, flat, "actions", dasherize(name)) %><%= dasherize(name) %>.actions';<% } %>

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: <% if(feature) { %><%= classify(name) %>Actions<% } else { %>Action<% } %>): State {
  switch (action.type) {
<% if(feature) { %>
    case <%= classify(name) %>ActionTypes.Load<%= classify(name) %>s:
      return state;

<% } %>
    default:
      return state;
  }
}
