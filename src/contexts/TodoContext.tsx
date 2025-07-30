import React, { useState, useEffect } from 'react';
import type { Todo } from '../types/Todo';
import { v4 as uuidv4 } from 'uuid';
import { TodoContext } from './TodoContextType';
import { loadTodos, saveTodos } from '../utils/sessionStorage';

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with data from sessionStorage
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [storageError, setStorageError] = useState<string | null>(null);

  // Persist todos to sessionStorage whenever the todos array changes
  useEffect(() => {
    const success = saveTodos(todos);
    if (!success) {
      setStorageError('Storage quota exceeded – your latest changes may not be saved.');
      // Clear error after 5 seconds
      setTimeout(() => setStorageError(null), 5000);
    } else if (storageError) {
      setStorageError(null);
    }
  }, [todos, storageError]);

  const addTodo = (title: string, description: string) => {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const editTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, ...updates } : todo)));
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ 
      todos, 
      addTodo, 
      editTodo, 
      toggleTodoCompletion, 
      deleteTodo,
      storageError 
    }}>
      {children}
    </TodoContext.Provider>
  );
};

// No re-exports to avoid react-refresh/only-export-components error