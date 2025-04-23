import React, { useState } from 'react';
import {
    InputBase,
    IconButton,
    Paper,
    Box,
    Button,
    useTheme,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const suggestions = [
    'Can you summarize the top key findings so far?',
    'What information would help clarify this issue?',
    'What specialist the patient go next for and why?',
];

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
    data: string;
    setBotReply: React.Dispatch<React.SetStateAction<{ from: string; text: string | { summaryResponse: string; citations: Array<{ name: string; url: string }> } }[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ data, setBotReply }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const carouselRef = React.useRef<HTMLDivElement>(null); // Reference to the carousel container
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
            const response = await fetch('https://assist-pc-backend-dev.onrender.com/ask-pathway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([data, searchTerm]),
            });

            const text = await response.json();
            setBotReply((prev) => [
                ...prev.slice(0, -1), // Remove the placeholder
                { from: 'bot', text }, // Add the actual bot response
            ]);
        } catch (error) {
            console.error('Error fetching response:', error);
            setBotReply((prev) => [
                ...prev.slice(0, -1), // Remove the placeholder
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
                left: -carouselRef.current.offsetWidth / 2, // Scroll half the width of the container
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: carouselRef.current.offsetWidth / 2, // Scroll half the width of the container
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
                padding: 1.5,
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
                    sx={{ p: '4px', color: '#8e9cff' }}
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
                    marginTop: 1,
                    justifyContent: 'space-between',
                }}
            >
                <IconButton onClick={scrollLeft} aria-label="scroll-left">
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

                <Box
                    ref={carouselRef} // Attach the ref to the carousel container
                    sx={{
                        overflowX: 'auto', // Enable horizontal scrolling
                        display: 'flex',
                        width: '85%',
                        justifyContent: 'center',
                        position: 'relative',
                        scrollSnapType: 'x mandatory', // Optional: Snap scrolling for better UX
                        '&::-webkit-scrollbar': {
                            display: 'none', // Hide scrollbar for a cleaner look
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            width: `${suggestions.length * 100}%`,
                        }}
                    >
                        {suggestions.map((suggestion, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 'auto',
                                    flexShrink: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    scrollSnapAlign: 'start',
                                    marginLeft: "10px",
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
