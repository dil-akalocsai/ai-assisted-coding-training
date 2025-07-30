import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTodos, saveTodos, isValidTodos } from '../utils/sessionStorage';
import { Todo } from '../types/Todo';

const mockTodos: Todo[] = [
  { 
    id: '1', 
    title: 'Test Todo 1', 
    description: 'Test description 1',
    completed: false,
    createdAt: new Date('2023-01-01T00:00:00.000Z')
  },
  { 
    id: '2', 
    title: 'Test Todo 2', 
    description: 'Test description 2',
    completed: true,
    createdAt: new Date('2023-01-02T00:00:00.000Z')
  },
];

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('sessionStorage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isValidTodos', () => {
    it('should return true for valid todos array', () => {
      const serializedTodos = mockTodos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString()
      }));
      expect(isValidTodos(serializedTodos)).toBe(true);
    });

    it('should return false for non-array', () => {
      expect(isValidTodos({})).toBe(false);
      expect(isValidTodos('string')).toBe(false);
      expect(isValidTodos(null)).toBe(false);
      expect(isValidTodos(undefined)).toBe(false);
    });

    it('should return false for array with invalid todo objects', () => {
      expect(isValidTodos([{ id: 1, title: 'test', description: 'test', completed: false, createdAt: '2023-01-01' }])).toBe(false);
      expect(isValidTodos([{ title: 'test', description: 'test', completed: false, createdAt: '2023-01-01' }])).toBe(false);
      expect(isValidTodos([{ id: 'test', completed: false, createdAt: '2023-01-01' }])).toBe(false);
      expect(isValidTodos([{ id: 'test', title: 'test', description: 'test', createdAt: '2023-01-01' }])).toBe(false);
      expect(isValidTodos([{ id: 'test', title: 'test', description: 'test', completed: false }])).toBe(false);
    });

    it('should return true for empty array', () => {
      expect(isValidTodos([])).toBe(true);
    });
  });

  describe('loadTodos', () => {
    it('should return empty array when no data in storage', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      expect(loadTodos()).toEqual([]);
    });

    it('should return parsed todos when valid data exists', () => {
      const serializedTodos = mockTodos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString()
      }));
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(serializedTodos));
      
      const result = loadTodos();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Test Todo 1');
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should return empty array and clear storage when data is corrupt JSON', () => {
      mockSessionStorage.getItem.mockReturnValue('invalid json');
      expect(loadTodos()).toEqual([]);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('todos');
    });

    it('should return empty array and clear storage when data is invalid structure', () => {
      const invalidData = [{ id: 1, title: 'test', completed: false }];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(invalidData));
      expect(loadTodos()).toEqual([]);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('todos');
    });
  });

  describe('saveTodos', () => {
    it('should save todos successfully', () => {
      expect(saveTodos(mockTodos)).toBe(true);
      
      const savedData = JSON.parse(mockSessionStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(2);
      expect(savedData[0].id).toBe('1');
      expect(savedData[0].createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'todos',
        expect.stringContaining('"id":"1"')
      );
    });

    it('should handle QuotaExceededError', () => {
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      mockSessionStorage.setItem.mockImplementation(() => {
        throw quotaError;
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      expect(saveTodos(mockTodos)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Storage quota exceeded – your latest changes may not be saved.'
      );

      consoleSpy.mockRestore();
    });

    it('should handle other storage errors', () => {
      const otherError = new Error('Other error');
      mockSessionStorage.setItem.mockImplementation(() => {
        throw otherError;
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(saveTodos(mockTodos)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save todos to sessionStorage:',
        otherError
      );

      consoleSpy.mockRestore();
    });
  });
});