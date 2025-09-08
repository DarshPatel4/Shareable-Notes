export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  isEncrypted?: boolean;
  password?: string;
}

export interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  clearAllNotes: () => void;
  // History for Undo/Redo
  history: Note[][];
  future: Note[][];
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
} 