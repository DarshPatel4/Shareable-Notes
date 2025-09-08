import React, { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { Lightbulb as LightbulbIcon } from '@mui/icons-material';

interface AIInsightsProps {
  noteContent: string;
}

interface Insight {
  type: 'summary' | 'themes' | 'recommendations';
  content: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ noteContent }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanText = (text: string): string => {
    // Remove any non-printable characters and trim whitespace
    return text.replace(/[^\x20-\x7E]/g, '').trim();
  };

  const analyzeContent = async () => {
    setLoading(true);
    setError(null);
    
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('API key is not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    const cleanedContent = cleanText(noteContent);
    if (!cleanedContent) {
      setError('Please enter some text to analyze.');
      setLoading(false);
      return;
    }

    console.log('Cleaned Note Content:', cleanedContent);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that analyzes notes and provides insights. Provide concise, helpful insights in the following format: 1. A brief summary, 2. Key themes, 3. Recommendations for improvement or related topics.'
            },
            {
              role: 'user',
              content: `Analyze this note and provide insights: ${cleanedContent}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Failed to get insights: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Parse the AI response into structured insights
      const parsedInsights: Insight[] = [
        {
          type: 'summary',
          content: aiResponse.split('Key themes:')[0].replace('1. ', '').trim()
        },
        {
          type: 'themes',
          content: aiResponse.split('Key themes:')[1]?.split('Recommendations:')[0].trim() || ''
        },
        {
          type: 'recommendations',
          content: aiResponse.split('Recommendations:')[1]?.trim() || ''
        }
      ];

      setInsights(parsedInsights);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: '#f8f9fa' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LightbulbIcon sx={{ mr: 1, color: '#ffd700' }} />
        <Typography variant="h6">AI Insights</Typography>
      </Box>

      {!insights.length && !loading && (
        <Button
          variant="contained"
          onClick={analyzeContent}
          disabled={!noteContent.trim()}
          sx={{ mb: 2 }}
        >
          Generate Insights
        </Button>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {insights.map((insight, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}:
          </Typography>
          <Typography variant="body2">
            {insight.content}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default AIInsights; 