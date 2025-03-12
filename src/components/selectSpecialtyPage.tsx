"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

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

interface SelectSpecialtyPageProps {
  setSelectedSpecialty: (specialty: string) => void;
  setClinicalQuestion: (question: string) => void; // Added function to update clinical question
  data: SuggestionsResp;
}

interface Specialty {
  name: string;
  response: string;
}

const specialties: Specialty[] = [
  { name: "Infectious Disease", response: "24-48 hours" },
  { name: "Endocrinology", response: "24-72 hours" },
  { name: "Hematology", response: "24-48 hours" },
];

export default function SelectSpecialtyPage({ data, setSelectedSpecialty, setClinicalQuestion }: SelectSpecialtyPageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(data.suggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

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

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ mt: 0,mb:0, width: "100%" }}>
        {suggestions !== null && suggestions.length > 0 && (
          <>
          <h3>Suggestions</h3>
          <Typography variant="body1" sx={{ mt: 2, color: "red" }}>Choose the best version of your clinical question and improve it for clarity and detail so it clearly addresses the medical issue.</Typography>
          <Box sx={{ bgcolor: "background.paper", boxShadow: 3, borderRadius: "12px", mt: 2, p: 2 , pb:0.3}}>
            {suggestions.map((suggestion, index) => (
              <Box key={index} sx={{ mb: 2, display:"flex"}}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={suggestion}
                  onChange={(e) => handleSuggestionChange(index, e.target.value)}
                />
                <Button
                  variant={selectedSuggestion === suggestion ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  sx={{  minWidth: "100px", ml: 2 }}
                >
                  {selectedSuggestion === suggestion ? "Deselect" : "Select"}
                </Button>
              </Box>
            ))}
          </Box>
          </>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: "bold", textAlign: "left", width: "100%" }}>
        Select Specialty
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          width: "100%",
        }}
      >
        {specialties.map((specialty, index) => (
          <Paper
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setSelectedSpecialty(specialty.name);
            }}
            sx={{
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: selectedIndex === index ? "primary.main" : "background.paper",
              color: selectedIndex === index ? "white" : "text.primary",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "calc(30% - 16px)",
              minWidth: "200px",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: selectedIndex === index ? "primary.main" : "grey.200",
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {specialty.name}
            </Typography>
            <Typography variant="body2">{specialty.response}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
