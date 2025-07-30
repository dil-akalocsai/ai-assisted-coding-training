# Todo App with Atlas UI

![CI Status](https://github.com/dil-asomlai/ai-assisted-coding-training/actions/workflows/ci.yml/badge.svg)

A React-based Todo application built with TypeScript, Material UI, and Atlas UI components. This project demonstrates modern React development practices with proper state management, component architecture, and comprehensive testing.

## Features

- ✅ Create, read, update, and delete todo items
- ✅ Mark todos as completed
- ✅ Session persistence with browser storage
- ✅ Responsive design with Material UI
- ✅ TypeScript for type safety
- ✅ React Context for state management
- ✅ Comprehensive test coverage
- ✅ Prettier and ESLint for code quality
- ✅ Husky pre-commit hooks
- ✅ GitHub Actions CI/CD workflow

## Quick Start

```bash
# Clone the repository
git clone https://github.com/dil-asomlai/ai-assisted-coding-training.git

# Navigate to project directory
cd ai-assisted-coding-training

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production-ready app
- `npm run lint` - Run ESLint to fix code issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run preview` - Preview production build locally

## Session Persistence

The Todo app automatically persists your tasks to `sessionStorage`, ensuring your todo list survives page refreshes within the same browser session.

### Key Features

- **Automatic Saving**: All changes are automatically saved to browser session storage
- **Data Validation**: Corrupt or invalid data is safely handled and cleared
- **Error Handling**: Storage quota errors are gracefully handled with user notifications
- **Session Scope**: Data persists only for the current browser session (cleared when browser is closed)

### Limitations

- Data is only available within the same browser session
- Storage quota limitations may prevent saving large amounts of data
- Data is not synchronized across different browser tabs or devices
- Incognito/private browsing mode may have additional restrictions

### Technical Details

- **Storage Key**: `todos`
- **Data Format**: JSON array of Todo objects with Date serialization
- **Validation**: Ensures each todo has `id: string`, `title: string`, `description: string`, `completed: boolean`, `createdAt: Date`
- **Error Recovery**: Automatically clears corrupt data and falls back to empty state
- **User Feedback**: Toast notifications for storage quota exceeded errors

## Project Structure

The project follows a feature-based organization:

```
src/
├── __tests__/                   # Test files
├── assets/                      # Media assets
├── components/                  # React components
│   ├── Toast/                   # Toast notification component
│   └── ...
├── contexts/                    # React contexts
├── providers/                   # React providers
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
│   └── sessionStorage.ts        # Session storage helpers
└── ...
```

## AI Development Support

This project is set up to work seamlessly with various AI coding assistants:

- For comprehensive project documentation, see [AI.md](./AI.md)
- For GitHub Copilot, see [.github/copilot/suggestions.json](./.github/copilot/suggestions.json)
- For Cursor AI, see [.cursor](./.cursor)
- For Claude Code, see [CLAUDE.md](./CLAUDE.md)

These files contain helpful information for AI tools to understand the project's structure, patterns, and practices.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.