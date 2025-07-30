import { createContext } from 'react';
import { Todo } from '../types/Todo';

export interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string, description: string) => void;
  editTodo: (id: string, updates: Partial<Todo>) => void;
  toggleTodoCompletion: (id: string) => void;
  deleteTodo: (id: string) => void;
  storageError: string | null;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);