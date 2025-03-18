"use client";

import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";

interface SuggestionsResp {
  assessment: {
    appropriate: boolean;
    missingKeyInfo: string | null;
    reason: string | null;
  };
  clinicalNotes: string;
  originalQuestion: string;
  suggestions: string[];
}

interface ClinicalQuestionPageProps {
  setClinicalQuestion: (question: string) => void;
  setClinicalNotes: (question: string) => void;
  questionError: string;
  notesError: string;
  setQuestionError: (question: string) => void;
  setNotesError: (question: string) => void;
  data: SuggestionsResp;
}

export default function ClinicalQuestionPage({
  data,
  questionError,
  notesError,
  setQuestionError,
  setClinicalQuestion,
  setClinicalNotes,
  setNotesError,
}: ClinicalQuestionPageProps) {
  const [suggestions, setSuggestions] = useState<string[]>(data.suggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );

  useEffect(() => {
    setSuggestions(data.suggestions);
  }, [data.suggestions]);

  const handleSuggestionChange = (index: number, value: string) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index] = value;
    setSuggestions(newSuggestions);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    if (selectedSuggestion === suggestion) {
      setSelectedSuggestion(null);
      setClinicalQuestion(data.originalQuestion); // Reset to original question
    } else {
      setSelectedSuggestion(suggestion);
      setClinicalQuestion(suggestion); // Update question with selected suggestion
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClinicalQuestion(value);
    if (value.trim().split(" ").length < 5) {
      setQuestionError("Clinical question must be at least 5 words long.");
    } else {
      setQuestionError("");
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClinicalNotes(value);
    if (value.trim().split(" ").length < 5) {
      setNotesError("Clinical notes must be at least 5 words long.");
    } else {
      setNotesError("");
    }
  };

  return (
    <Box sx={{ alignItems: "flex-start", width: "100%" }}>
      <Typography variant="h6" align="left" sx={{ mb: 2, fontWeight: "bold" }}>
        What is your clinical question?
      </Typography>
      <FormControl fullWidth sx={{ mb: 0 }}>
        <TextField
          label="Enter your clinical question"
          multiline
          rows={3}
          onChange={handleQuestionChange}
          error={!!questionError}
        />
        <FormHelperText error={!!questionError} sx={{ minHeight: "1.7em" }}>
          {questionError}
        </FormHelperText>
      </FormControl>
      <Typography variant="h6" align="left" sx={{ mb: 2, fontWeight: "bold" }}>
        What are your clinical notes?
      </Typography>
      <FormControl fullWidth sx={{ mb: 0 }}>
        <TextField
          label="Enter your clinical notes"
          multiline
          rows={7}
          onChange={handleNotesChange}
          error={!!notesError}
        />
        <FormHelperText error={!!notesError} sx={{ minHeight: "1.7em" }}>
          {notesError}
        </FormHelperText>
      </FormControl>
      <Box sx={{ mt: 0, mb: 0, width: "100%" }}>
      {data.suggestions !== null && data.suggestions.length > 0 && (
          <>
            <h3>Suggestions</h3>
            <Typography variant="body1" sx={{ mt: 2, color: "red" }}>
              Choose the best version of your clinical question and improve it
              for clarity and detail so it clearly addresses the medical issue.
            </Typography>
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                borderRadius: "12px",
                mt: 2,
                p: 2,
                pb: 0.3,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <Box key={index} sx={{ mb: 2, display: "flex" }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={suggestion}
                    onChange={(e) =>
                      handleSuggestionChange(index, e.target.value)
                    }
                  />
                  <Button
                    variant={
                      selectedSuggestion === suggestion
                        ? "contained"
                        : "outlined"
                    }
                    color="primary"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    sx={{ minWidth: "100px", ml: 2 }}
                  >
                    {selectedSuggestion === suggestion ? "Deselect" : "Select"}
                  </Button>
                </Box>
              ))}
            </Box>
            </>
          )}
      </Box>
    </Box>
  );
}
