# Shareable Notes Application

A modern, feature-rich notes application built with React and TypeScript. This application allows users to create, edit, and manage their notes with advanced features like rich text editing, note pinning, and AI-powered features.

## Features

- **Custom Rich Text Editor**
  - Bold, italic, underline formatting
  - Text alignment options
  - Font size control
  - Built from scratch (no external rich text editor libraries)

- **Note Management**
  - Create, edit, and delete notes
  - Pin important notes
  - Sort notes by pin status and last updated time

- **AI Features**
  - Auto Glossary Highlighting
  - AI-driven insights
  - Basic grammar checking

- **User Interface**
  - Clean and intuitive design
  - Responsive layout
  - Material-UI components

- **Data Persistence**
  - Local storage for notes
  - Automatic saving

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
  ├── components/        # React components
  ├── store/            # State management
  ├── types/            # TypeScript types
  ├── utils/            # Utility functions
  ├── App.tsx           # Main application component
  └── main.tsx          # Application entry point
```

## Technologies Used

- React
- TypeScript
- Material-UI
- Zustand (State Management)
- Vite (Build Tool)

## Future Enhancements

- Note encryption
- Cloud synchronization
- Advanced AI features
- Collaborative editing
- Export/Import functionality
