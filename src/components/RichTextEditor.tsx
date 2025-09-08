import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Tooltip, Select, MenuItem, Paper, Popover, Typography as MuiTypography } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Spellcheck as SpellcheckIcon,
} from '@mui/icons-material';
import { checkGrammar } from '../utils/aiFeatures';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16px');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverText, setPopoverText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Only update innerHTML if not focused (prevents cursor jump and reverse writing)
  useEffect(() => {
    if (editorRef.current && !isFocused && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = getGrammarCheckedHTML(content);
    }
    // eslint-disable-next-line
  }, [content, isFocused]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    execCommand('fontSize', size);
  };

  // Grammar check logic
  const getGrammarCheckedHTML = (raw: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = raw;
    const text = tempDiv.innerText;
    let html = raw;
    const errors = checkGrammar(text);
    errors.forEach(({ text: errText, error }) => {
      const regex = new RegExp(`\\b${errText}\\b`, 'g');
      html = html.replace(
        regex,
        `<span class='grammar-error' data-error="${error}">${errText}</span>`
      );
    });
    return html;
  };

  // Popover for grammar suggestions
  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('grammar-error')) {
      setPopoverText(target.getAttribute('data-error') || '');
      setAnchorEl(target);
    }
  };
  const handleMouseOut = () => {
    setAnchorEl(null);
    setPopoverText('');
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
      <Box sx={{ borderBottom: '1px solid #eee', p: 1, display: 'flex', gap: 1, alignItems: 'center', background: '#fafbfc', borderTopLeftRadius: 8, borderTopRightRadius: 8, flexWrap: 'wrap' }}>
        <Tooltip title="Bold"><IconButton onClick={() => execCommand('bold')}><FormatBold /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton onClick={() => execCommand('italic')}><FormatItalic /></IconButton></Tooltip>
        <Tooltip title="Underline"><IconButton onClick={() => execCommand('underline')}><FormatUnderlined /></IconButton></Tooltip>
        <Tooltip title="Align Left"><IconButton onClick={() => execCommand('justifyLeft')}><FormatAlignLeft /></IconButton></Tooltip>
        <Tooltip title="Align Center"><IconButton onClick={() => execCommand('justifyCenter')}><FormatAlignCenter /></IconButton></Tooltip>
        <Tooltip title="Align Right"><IconButton onClick={() => execCommand('justifyRight')}><FormatAlignRight /></IconButton></Tooltip>
        <Select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          size="small"
          sx={{ minWidth: 80, ml: 2 }}
        >
          <MenuItem value="12px">12px</MenuItem>
          <MenuItem value="14px">14px</MenuItem>
          <MenuItem value="16px">16px</MenuItem>
          <MenuItem value="18px">18px</MenuItem>
          <MenuItem value="20px">20px</MenuItem>
        </Select>
        <Tooltip title="Grammar Check"><SpellcheckIcon color="primary" sx={{ ml: 2 }} /></Tooltip>
      </Box>
      <Box
        ref={editorRef}
        contentEditable
        spellCheck
        sx={{
          p: { xs: 1, sm: 2 },
          minHeight: { xs: '120px', sm: '200px' },
          outline: 'none',
          background: '#fff',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          fontSize: { xs: '14px', sm: fontSize },
          fontFamily: 'inherit',
          transition: 'box-shadow 0.2s',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 2px #1976d2',
          },
        }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        suppressContentEditableWarning
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMouseOut}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        disableRestoreFocus
      >
        <MuiTypography sx={{ p: 2, maxWidth: 250, color: 'red' }}>{popoverText}</MuiTypography>
      </Popover>
    </Paper>
  );
};

export default RichTextEditor; 