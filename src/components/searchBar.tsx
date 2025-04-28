import React, { useState , useEffect} from 'react';
import {
    InputBase,
    IconButton,
    Paper,
    Box,
    Button,
    useTheme,
    CircularProgress,
    Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import EventSourceStream from '@server-sent-stream/web';


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

interface SearchBarProps {
    barLoading: boolean;
    data: string;
    setBotReply: React.Dispatch<React.SetStateAction<{ from: string; text: string | { summaryResponse: string; citations: Array<{ name: string; url: string }> } }[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ data, setBotReply, barLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true); // State for skeleton loading
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const theme = useTheme();

    // Fetch suggestions from the API
    const fetchSuggestions = async () => {
        setSuggestionsLoading(true); // Start skeleton loading
        try {
            const requestBody = [ data ];
            const response = await fetch('https://assist-pc-backend-dev.onrender.com/followup-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
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
            setSuggestionsLoading(false); // Stop skeleton loading
        }
    };

    useEffect(() => {
        if (!barLoading) {
            fetchSuggestions();
        }
    }, [data, barLoading]);

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
            const requestBody = [data, searchTerm.trim()];
            const response = await fetch('https://assist-pc-backend-dev.onrender.com/ask-pathway-streamed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (!response.body || !(response.body instanceof ReadableStream)) {
                throw new Error('Response body is not a readable stream');
            }

            const stream = response.body;
            const decoder = new EventSourceStream();
            stream.pipeThrough(decoder);

            const reader = decoder.readable.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done || value.data == null) break;

                const jsonStr = value.data;
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

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -carouselRef.current.offsetWidth / 2,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: carouselRef.current.offsetWidth / 2,
                behavior: 'smooth',
            });
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
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 530,
                margin: '0',
                borderRadius: 4,
                backgroundColor: 'white',
                boxShadow: 2,
                padding: 0.3,
                paddingBottom: 1,
                position: 'relative',
                border: `1px solid ${theme.palette.primary.main}`,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <IconButton sx={{ p: '8px 6px', color: '#777' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <StyledInputBase
                    placeholder="Start typing..."
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchTerm}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <IconButton
                    sx={{ p: '4px', color: '#8e9cff', width:"3rem", height:"3rem"}}
                    aria-label="play"
                    onClick={handleSubmit}
                    disabled={loading}
                    
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <PlayCircleFilledWhiteIcon sx={{ fontSize: '2.5rem' }} />
                    )}
                </IconButton>
            </Box>

            {/* Suggestion Carousel */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: 0,
                    justifyContent: 'space-between',
                }}
            >
                <IconButton onClick={scrollLeft} aria-label="scroll-left">
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

                <Box
    ref={carouselRef}
    sx={{
        overflowX: 'auto',
        display: 'flex',
        width: '100%',
        justifyContent: "flex-start",
        position: 'relative',
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    }}
>
    <Box
        sx={{
            display: 'flex',
            flexWrap: 'nowrap',
        }}
    >
        {suggestionsLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                      key={index}
                      variant="rectangular"
                      width={200}
                      height={40}
                      sx={{
                          margin: '0 10px',
                          borderRadius: 6,
                          flexShrink: 0,
                          scrollSnapAlign: 'start',  
                      }}
                  />
              ))
            : suggestions.map((suggestion, index) => (
                  <Box
                      key={index}
                      sx={{
                          flexShrink: 0,
                          flexBasis: '85%', // Ensures one item fits in the visible area
                          display: 'flex',
                          justifyContent: 'left',
                          scrollSnapAlign: 'start',
                          padding: '0 5px',
                      }}
                  >
                      <Button
                          variant="text"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              color: '#444',
                              backgroundColor: '#f0f0f0',
                              '&:hover': {
                                  backgroundColor: '#e0e0e0',
                              },
                              fontSize: '0.7rem',
                              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
                              textAlign: 'center',
                              textTransform: 'none',
                              maxHeight: '62px',
                          }}
                      >
                          {suggestion}
                      </Button>
                  </Box>
              ))}
    </Box>
</Box>

                <IconButton onClick={scrollRight} aria-label="scroll-right">
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default SearchBar;
