"use client";

import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import React from "react";
import Footer from "./footer";



interface ClinicalQuestionPageProps {
  setClinicalQuestion: (question: string) => void;
  setClinicalNotes: (question: string) => void;
  questionError: string;
  notesError: string;
  setQuestionError: (question: string) => void;
  setNotesError: (question: string) => void;
}

export default function ClinicalQuestionPage({
  questionError,
  notesError,
  setQuestionError,
  setClinicalQuestion,
  setClinicalNotes,
  setNotesError,
}: ClinicalQuestionPageProps) {



  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClinicalQuestion(value);
    if (value.trim().split(" ").length < 4) {
      setQuestionError("Clinical question must be at least 5 words long.");
    } else {
      setQuestionError("");
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClinicalNotes(value);
    if (value.trim().split(" ").length < 4) {
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
    <Footer />

    </Box>
  );
}
