import './App.css';
import { CssBaseline, Container, Box, Paper } from '@mui/material';
import { AtlasThemeProvider } from './providers/ThemeProvider';
import { TodoProvider } from './contexts/TodoContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { CreateTodoButton } from './components/CreateTodoButton/CreateTodoButton';
import { Toast } from './components/Toast/Toast';
import { useTodo } from './hooks/useTodo';
import type { Todo } from './types/Todo';

// Separate component to access TodoContext inside TodoProvider
const AppContent = () => {
  const { storageError } = useTodo();

  const handleEditTodo = (todo: Todo) => {
    // This will be implemented in the future task
    console.log('Edit todo:', todo);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme => theme.palette.background.default,
      }}
    >
      <Header />
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box component="main">
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2>Your Todos</h2>
              <CreateTodoButton />
            </Box>
            <TodoList onEditTodo={handleEditTodo} />
          </Box>
        </Paper>
      </Container>
      <Footer />
      {storageError && (
        <Toast 
          message={storageError} 
          type="warning"
        />
      )}
    </Box>
  );
};

function App() {
  return (
    <AtlasThemeProvider>
      <CssBaseline />
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </AtlasThemeProvider>
  );
}

export default App;