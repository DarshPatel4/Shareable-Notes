import React from 'react';
import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, ClearAll as ClearAllIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useNoteStore } from './store/noteStore';
import RichTextEditor from './components/RichTextEditor';
import Note from './components/Note';
import { Note as NoteType } from './types';

function App() {
  const { notes, addNote, updateNote, clearAllNotes } = useNoteStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  const handleAddNote = () => {
    if (title.trim() && content.trim()) {
      addNote({
        title: title.trim(),
        content: content.trim(),
        isPinned: false,
      });
      setTitle('');
      setContent('');
      setIsDialogOpen(false);
    }
  };

  const handleEditNote = (note: NoteType) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleUpdateNote = () => {
    if (editingNote && title.trim() && content.trim()) {
      updateNote(editingNote.id, {
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
      setIsEditing(false);
      setEditingNote(null);
      setIsDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setTitle('');
    setContent('');
    setIsEditing(false);
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleClearAllConfirm = () => {
    clearAllNotes();
    setIsClearAllDialogOpen(false);
  };

  const handleExportNotes = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "notes_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', p: 0, m: 0 }}>
      <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <Paper elevation={4} sx={{ border: '3px solid #90caf9', borderRadius: 0, p: { xs: 1, sm: 4 }, boxShadow: 6, minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', background: 'rgba(255,255,255,0.98)' }}>
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'flex-start', sm: 'space-between' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 0 }, flexWrap: 'wrap' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                lineHeight: 1.1,
                mb: { xs: 1, sm: 0 },
                flexGrow: 1,
                textAlign: 'left-center',
              }}
            >
              Shareable Notes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsDialogOpen(true)}
                sx={{ borderRadius: 2, fontWeight: 600, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '1rem', sm: '1.1rem' }, py: { xs: 1.5, sm: 1 } }}
              >
                New Note
              </Button>
              {notes.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearAllIcon />}
                  onClick={() => setIsClearAllDialogOpen(true)}
                  sx={{ borderRadius: 2, fontWeight: 600, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '1rem', sm: '1.1rem' }, py: { xs: 1.5, sm: 1 } }}
                >
                  Clear All
                </Button>
              )}
              {notes.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportNotes}
                  sx={{ borderRadius: 2, fontWeight: 600, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '1rem', sm: '1.1rem' }, py: { xs: 1.5, sm: 1 } }}
                >
                  Export Notes
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                overflowY: 'auto',
                p: 1,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr 1fr',
                },
                gridAutoRows: 'minmax(180px, auto)',
                gap: 3,
                maxHeight: { xs: 'calc(100vh - 220px)', sm: 'calc(100vh - 220px)' },
              }}
            >
              {sortedNotes.length === 0 ? (
                <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 6 }}>
                  <Typography color="text.secondary">
                    No notes yet. Click <b>New Note</b> to get started!
                  </Typography>
                </Box>
              ) : (
                sortedNotes.map((note, idx) => (
                  <Note key={note.id} note={note} onEdit={handleEditNote} colorIdx={idx} />
                ))
              )}
            </Box>
          </Box>
        </Paper>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{isEditing ? 'Edit Note' : 'New Note'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <RichTextEditor content={content} onChange={setContent} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={isEditing ? handleUpdateNote : handleAddNote}
              variant="contained"
              disabled={!title.trim() || !content.trim()}
            >
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isClearAllDialogOpen} onClose={() => setIsClearAllDialogOpen(false)}>
          <DialogTitle>Confirm Clear All Notes</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete all notes? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsClearAllDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleClearAllConfirm} color="error" variant="contained">
              Clear All
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default App; 