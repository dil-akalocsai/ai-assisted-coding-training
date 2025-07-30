import { Todo } from '../types/Todo';

const STORAGE_KEY = 'todos';

/**
 * Validates that the data is a valid array of Todo objects
 */
export const isValidTodos = (data: unknown): data is Todo[] => {
  if (!Array.isArray(data)) return false;
  
  return data.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.description === 'string' &&
      typeof item.completed === 'boolean' &&
      typeof item.createdAt === 'string' // JSON stringified Date
  );
};

/**
 * Load todos from sessionStorage
 * Returns empty array if data is corrupt or doesn't exist
 */
export const loadTodos = (): Todo[] => {
  try {
    const storedData = window.sessionStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    
    if (isValidTodos(parsedData)) {
      // Convert createdAt back to Date objects
      return parsedData.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    } else {
      console.warn('Invalid todos data found in sessionStorage. Clearing and falling back to empty array.');
      window.sessionStorage.removeItem(STORAGE_KEY);
      return [];
    }
  } catch (error) {
    console.warn('Failed to parse todos from sessionStorage. Falling back to empty array.', error);
    window.sessionStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

/**
 * Save todos to sessionStorage
 * Returns true if successful, false if quota exceeded
 */
export const saveTodos = (todos: Todo[]): boolean => {
  try {
    // Convert Date objects to strings for JSON serialization
    const serializedTodos = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString()
    }));
    
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializedTodos));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded – your latest changes may not be saved.');
      return false;
    } else {
      console.error('Failed to save todos to sessionStorage:', error);
      return false;
    }
  }
};