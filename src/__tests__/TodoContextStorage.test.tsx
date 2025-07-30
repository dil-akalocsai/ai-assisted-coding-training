import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TodoProvider } from '../contexts/TodoContext';
import { useTodo } from '../hooks/useTodo';
import { Todo } from '../types/Todo';

// Mock the storage utilities
vi.mock('../utils/sessionStorage', () => ({
  loadTodos: vi.fn(() => []),
  saveTodos: vi.fn(() => true),
}));

const TestComponent = () => {
  const { todos, addTodo, toggleTodoCompletion, deleteTodo, storageError } = useTodo();
  
  return (
    <div>
      <div data-testid="todo-count">{todos.length}</div>
      <div data-testid="storage-error">{storageError || 'no-error'}</div>
      <button onClick={() => addTodo('Test Todo', 'Test description')}>Add Todo</button>
      {todos.map(todo => (
        <div key={todo.id} data-testid={`todo-${todo.id}`}>
          <span>{todo.title}</span>
          <span>{todo.completed ? 'completed' : 'pending'}</span>
          <button onClick={() => toggleTodoCompletion(todo.id)}>Toggle</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

describe('TodoContext with sessionStorage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any existing timers
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should hydrate from sessionStorage on mount', async () => {
    const { loadTodos } = await import('../utils/sessionStorage');
    const mockStoredTodos: Todo[] = [
      { 
        id: '1', 
        title: 'Stored Todo', 
        description: 'Stored description',
        completed: false,
        createdAt: new Date('2023-01-01')
      }
    ];
    (loadTodos as any).mockReturnValue(mockStoredTodos);

    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    expect(screen.getByText('Stored Todo')).toBeInTheDocument();
    expect(loadTodos).toHaveBeenCalled();
  });

  it('should save to sessionStorage when todos change', async () => {
    const { saveTodos } = await import('../utils/sessionStorage');
    
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    act(() => {
      screen.getByText('Add Todo').click();
    });

    expect(saveTodos).toHaveBeenCalled();
    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
  });

  it('should show storage error when quota exceeded', async () => {
    const { saveTodos } = await import('../utils/sessionStorage');
    (saveTodos as any).mockReturnValue(false);
    
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    act(() => {
      screen.getByText('Add Todo').click();
    });

    expect(screen.getByTestId('storage-error')).toHaveTextContent(
      'Storage quota exceeded – your latest changes may not be saved.'
    );

    // Test that error clears after timeout
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('storage-error')).toHaveTextContent('no-error');
  });

  it('should perform all todo operations correctly', async () => {
    const { saveTodos } = await import('../utils/sessionStorage');
    
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // Add todo
    act(() => {
      screen.getByText('Add Todo').click();
    });

    expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();

    // Toggle completion
    act(() => {
      screen.getByText('Toggle').click();
    });

    expect(screen.getByText('completed')).toBeInTheDocument();

    // Delete todo
    act(() => {
      screen.getByText('Delete').click();
    });

    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    expect(saveTodos).toHaveBeenCalledTimes(3); // add, toggle, delete
  });

  it('should clear storage error when successful save occurs after failure', async () => {
    const { saveTodos } = await import('../utils/sessionStorage');
    (saveTodos as any)
      .mockReturnValueOnce(false) // First call fails
      .mockReturnValueOnce(true); // Second call succeeds
    
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // First operation fails
    act(() => {
      screen.getByText('Add Todo').click();
    });

    expect(screen.getByTestId('storage-error')).toHaveTextContent(
      'Storage quota exceeded – your latest changes may not be saved.'
    );

    // Second operation succeeds
    act(() => {
      screen.getByText('Add Todo').click();
    });

    expect(screen.getByTestId('storage-error')).toHaveTextContent('no-error');
  });
});