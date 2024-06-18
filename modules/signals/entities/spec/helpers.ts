import { SelectEntityId } from '../src';
import { Todo } from './mocks';

export const selectTodoId: SelectEntityId<Todo> = (todo) => todo._id;
