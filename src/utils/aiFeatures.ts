import { GlossaryTerm } from '../types';

export const identifyKeyTerms = (content: string): GlossaryTerm[] => {
  // Simple implementation that looks for capitalized words and technical terms
  const words = content.split(/\s+/);
  const terms: GlossaryTerm[] = [];
  
  words.forEach((word) => {
    if (word.length > 3 && /^[A-Z]/.test(word)) {
      terms.push({
        term: word,
        definition: `Definition for ${word}`, 
      });
    }
  });

  return terms;
};

export const generateInsights = (content: string): string[] => {
  const insights: string[] = [];
  const plainContent = content.replace(/<[^>]+>/g, '');

  // 1. Summarization Suggestion
  if (plainContent.length > 300) {
    insights.push('This note is quite lengthy. Consider generating a summary to quickly grasp key points.');
  }
  
  // 2. Actionable Items
  if (plainContent.toLowerCase().includes('todo') || plainContent.toLowerCase().includes('action item')) {
    insights.push('This note appears to contain actionable items. Review them for follow-up.');
  }

  // 3. Question Identification
  if (plainContent.includes('?')) {
    insights.push('This note contains questions. You might want to add answers or follow up on these points.');
  }

  // 4. Sentiment Analysis (Mock)
  if (plainContent.toLowerCase().includes('great') || plainContent.toLowerCase().includes('excellent')) {
    insights.push('Positive sentiment detected. Consider what made this experience successful.');
  } else if (plainContent.toLowerCase().includes('problem') || plainContent.toLowerCase().includes('issue') || plainContent.toLowerCase().includes('error')) {
    insights.push('Potential challenges identified. Focus on solutions or next steps.');
  }

  // 5. Keyword Frequency (Mock - simplified)
  const programmingKeywords = ['react', 'javascript', 'typescript', 'css', 'html', 'frontend', 'backend', 'database'];
  const foundKeywords = programmingKeywords.filter(keyword => plainContent.toLowerCase().includes(keyword));
  if (foundKeywords.length > 2) {
    insights.push(`Key themes related to programming (${foundKeywords.join(', ')}) are prominent.`);
  }

  // 6. Suggest related notes (Mock)
  if (insights.length > 0) {
    insights.push('Consider linking this note to other related topics for better organization.');
  }

  return insights;
};

export const checkGrammar = (content: string): { text: string; error: string }[] => {
  // Mock implementation for grammar checking
  const errors: { text: string; error: string }[] = [];
  
  // Simple checks for common mistakes
  if (content.includes(' its ') && !content.includes(" it's ")) {
    errors.push({
      text: 'its',
      error: 'Consider using "it\'s" if you mean "it is"',
    });
  }

  return errors;
}; 