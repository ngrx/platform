export type User = { id: number; firstName: string; lastName: string };
export type Todo = { _id: string; text: string; completed: boolean };

export const user1: User = { id: 1, firstName: 'John', lastName: 'Doe' };
export const user2: User = { id: 2, firstName: 'Jane', lastName: 'Smith' };
export const user3: User = { id: 3, firstName: 'Joe', lastName: 'Johnson' };

export const todo1: Todo = { _id: 'x', text: 'Buy milk', completed: true };
export const todo2: Todo = { _id: 'y', text: 'Buy eggs', completed: false };
export const todo3: Todo = { _id: 'z', text: 'Make bread', completed: true };
