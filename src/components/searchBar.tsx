import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Skeleton,
  Paper,
  InputBase,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { styled } from '@mui/material/styles';


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  'MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


// interface SearchBarProps {
//     barLoading: boolean;
//     setBotReply: React.Dispatch<React.SetStateAction<{ from: string; text: string | { summaryResponse: string; citations: Array<{ name: string; url: string }> } }[]>>;
// }

export function SearchBar({
  searchTerm,
  setSearchTerm,
  setBotReply,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setBotReply: React.Dispatch<
    React.SetStateAction<
      { from: string; text: string | { summaryResponse: string; citations: Array<{ name: string; url: string }>; } }[]
    >
  >;
}) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setBotReply((prev) => [
      ...prev,
      { from: 'user', text: searchTerm.trim() },
      { from: 'bot', text: 'Loading' },
    ]);

    try {
      const response = await fetch('/api/ask-pathway-streamed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: searchTerm }),
        credentials: 'include',
      });

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const jsonStr = line.replace('data:', '').trim();
                try {
                  const parsed = JSON.parse(jsonStr);
                  setBotReply((prev) => [
                    ...prev.slice(0, -1),
                    { from: 'bot', text: parsed },
                  ]);
                } catch (err) {
                  console.warn('Invalid JSON in data:', err);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during streaming:', error);
      setBotReply((prev) => [
        ...prev.slice(0, -1),
        { from: 'bot', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 530,
        mx: 'auto',
        borderRadius: 4,
        backgroundColor: 'white',
        boxShadow: 2,
        p: 0.5,
        border: `1px solid ${theme.palette.primary.main}`,
      }}
    >
      <IconButton sx={{ p: '8px 6px', color: '#777' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <StyledInputBase
        placeholder="Start typing..."
        value={searchTerm}
        onChange={handleChange}
        sx={{ flex: 1 }}
      />
      <IconButton
        sx={{ p: '4px', color: '#8e9cff', width: '3rem', height: '3rem' }}
        aria-label="play"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : <PlayCircleFilledWhiteIcon sx={{ fontSize: '2.5rem' }} />}
      </IconButton>
    </Paper>
  );
}

export function FollowUpQuestions({
  barLoading,
  onSuggestionClick,
}: {
  barLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}) {
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const response = await fetch('/api/followup', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const result = await response.json();
      if (Array.isArray(result)) {
        setSuggestions(result);
      } else {
        console.warn('Unexpected response format:', result);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    if (!barLoading) {
      fetchSuggestions();
    }
  }, [barLoading]);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: 2,
        maxWidth: 800,
        mx: 'auto',
        mt: 2,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <ListIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Follow-Up Questions
        </Typography>
      </Box>

      <List disablePadding>
        {suggestionsLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Box key={idx}>
                <ListItemButton disabled>
                  <ListItemText
                    primary={
                      <>
                        <Skeleton variant="rectangular" width={400} height={20} sx={{ mb: 1, borderRadius: 6 }} />
                        <Skeleton variant="rectangular" width={200} height={20} sx={{ borderRadius: 6 }} />
                      </>
                    }
                  />
                </ListItemButton>
                {idx < 2 && <Divider />}
              </Box>
            ))
          : suggestions.map((question, index) => (
              <Box key={index}>
                <ListItemButton onClick={() => onSuggestionClick(question)}>
                  <ListItemText primary={question} />
                </ListItemButton>
                {index < suggestions.length - 1 && <Divider />}
              </Box>
            ))}
      </List>
    </Box>
  );
}