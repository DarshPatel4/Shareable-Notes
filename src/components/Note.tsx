import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Chip,
  Menu,
  MenuItem,
  DialogActions,
} from '@mui/material';
import {
  PushPin,
  Delete,
  Edit,
  Lock,
  Share as ShareIcon,
  Lightbulb as LightbulbIcon,
  WhatsApp,
  Email,
  ContentCopy,
} from '@mui/icons-material';
import { Note as NoteType } from '../types';
import { useNoteStore } from '../store/noteStore';
import { identifyKeyTerms, generateInsights } from '../utils/aiFeatures';
import AIInsights from './AIInsights';

interface NoteProps {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  colorIdx?: number;
}

const NOTE_COLORS = [
  '#e3f2fd', // blue
  '#fce4ec', // pink
  '#e8f5e9', // green
  '#fffde7', // yellow
  '#f3e5f5', // purple
  '#e0f7fa', // cyan
  '#fbe9e7', // orange
];

const Note: React.FC<NoteProps> = ({ note, onEdit, colorIdx = 0 }) => {
  const { togglePin, deleteNote } = useNoteStore();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isInsightsOpen, setInsightsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openShareMenu = Boolean(anchorEl);

  const noteContentForShare = `${note.title}\n\n${note.content.replace(/<[^>]+>/g, '')}`;

  const handleClickShare = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setAnchorEl(null);
  };

  const handleShareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(noteContentForShare)}`, '_blank');
    handleCloseShareMenu();
  };

  const handleShareToMail = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(note.title)}&body=${encodeURIComponent(noteContentForShare)}`, '_blank');
    handleCloseShareMenu();
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(noteContentForShare);
      setSnackbarOpen(true);
    } catch (err) {
      alert('Failed to copy note to clipboard.');
    }
    handleCloseShareMenu();
  };

  // Glossary highlighting
  const terms = identifyKeyTerms(note.content.replace(/<[^>]+>/g, ''));
  let highlightedContent = note.content;
  terms.forEach(({ term, definition }) => {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    highlightedContent = highlightedContent.replace(
      regex,
      `<span class=\"glossary-term\" title=\"${definition}\">${term}</span>`
    );
  });

  // Insights
  const insights = generateInsights(note.content.replace(/<[^>]+>/g, ''));

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
        transition: 'box-shadow 0.2s',
        minHeight: 180,
        '&:hover': {
          boxShadow: 6,
        },
        background: note.isPinned
          ? 'linear-gradient(90deg, #e3f2fd 0%, #fff 100%)'
          : NOTE_COLORS[colorIdx % NOTE_COLORS.length],
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {note.title}
          </Typography>
          <Box>
            <Tooltip title={note.isPinned ? 'Unpin' : 'Pin'}>
              <IconButton
                size="small"
                onClick={() => togglePin(note.id)}
                color={note.isPinned ? 'primary' : 'default'}
              >
                <PushPin />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(note)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => deleteNote(note.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton size="small" onClick={handleClickShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Insights">
              <IconButton size="small" onClick={() => setInsightsOpen(true)}>
                <LightbulbIcon />
              </IconButton>
            </Tooltip>
            {note.isEncrypted && (
              <Tooltip title="Encrypted">
                <IconButton size="small" color="primary">
                  <Lock />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            '& *': {
              maxWidth: '100%',
            },
            minHeight: '40px',
            wordBreak: 'break-word',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '& .glossary-term': {
              background: '#fffde7',
              borderBottom: '2px dotted #fbc02d',
              cursor: 'help',
              borderRadius: '3px',
              padding: '0 2px',
              transition: 'background 0.2s',
              fontWeight: 600,
            },
            '& .glossary-term:hover': {
              background: '#fff9c4',
            },
          }}
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
        {/* Read More button based on content length (rough check) */}
        {note.content.replace(/<[^>]+>/g, '').length > 100 && (
          <Button
            size="small"
            onClick={() => onEdit(note)}
            sx={{ textTransform: 'none', mt: -1, mb: 1, ml: 'auto', display: 'block' }}
          >
            Read more...
          </Button>
        )}
        {terms.length > 0 && (
          <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap', background: 'rgba(255, 236, 179, 0.2)', borderRadius: 2, p: 1 }}>
            {terms.map((t) => (
              <Chip key={t.term} label={t.term} size="small" color="warning" variant="outlined" />
            ))}
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </Typography>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Note copied to clipboard!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <Dialog open={isInsightsOpen} onClose={() => setInsightsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>AI Insights for "{note.title}"</DialogTitle>
          <DialogContent>
            <AIInsights noteContent={note.content} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInsightsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={openShareMenu}
          onClose={handleCloseShareMenu}
          MenuListProps={{ 'aria-labelledby': 'share-button' }}
        >
          <MenuItem onClick={handleCopyToClipboard}>
            <ContentCopy sx={{ mr: 1 }} /> Copy to clipboard
          </MenuItem>
          <MenuItem onClick={handleShareToWhatsApp}>
            <WhatsApp sx={{ mr: 1, color: '#25D366' }} /> Share on WhatsApp
          </MenuItem>
          <MenuItem onClick={handleShareToMail}>
            <Email sx={{ mr: 1, color: '#D44638' }} /> Share via Email
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default Note; 