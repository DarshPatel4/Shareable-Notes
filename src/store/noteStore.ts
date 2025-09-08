import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteStore } from '../types';
import CryptoJS from 'crypto-js';

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      history: [],
      future: [],
      
      addNote: (note) => {
        const currentNotes = get().notes;
        set((state) => ({ 
          notes: [...state.notes, { ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
          history: [...state.history, currentNotes],
          future: [],
        }));
      },
      updateNote: (id, updatedNote) => {
        const currentNotes = get().notes;
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  ...updatedNote,
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
          history: [...state.history, currentNotes],
          future: [],
        }));
      },
      deleteNote: (id) => {
        const currentNotes = get().notes;
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          history: [...state.history, currentNotes],
          future: [],
        }));
      },
      togglePin: (id) => {
        const currentNotes = get().notes;
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
          history: [...state.history, currentNotes],
          future: [],
        }));
      },
      clearAllNotes: () => {
        const currentNotes = get().notes;
        set((state) => ({
          notes: [],
          history: [...state.history, currentNotes],
          future: [],
        }));
      },

      undo: () => {
        set((state) => {
          const history = [...state.history];
          const previousNotes = history.pop();
          if (previousNotes) {
            return {
              notes: previousNotes,
              history,
              future: [state.notes, ...state.future],
            };
          }
          return state;
        });
      },
      redo: () => {
        set((state) => {
          const future = [...state.future];
          const nextNotes = future.shift();
          if (nextNotes) {
            return {
              notes: nextNotes,
              history: [...state.history, state.notes],
              future,
            };
          }
          return state;
        });
      },
      clearHistory: () => {
        set({ history: [], future: [] });
      },
    }),
    {
      name: 'notes-storage',
    }
  )
); 