export const ADD_FOO = 'ADD_FOO';

export function foos(state: string[] = [], { type, payload }: any): string[] {
  switch (type) {
    case ADD_FOO:
      return [...state, payload];
    default:
      return state;
  }
}
