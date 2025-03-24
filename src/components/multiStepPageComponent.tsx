"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import ClinicalQuestionPage from "./clinicalQuestionPage";
import ConsultPage from "./consultPage";
import LoadingPage from "./loadingPage";
import { postData } from "@/utils/api";

const steps = ["Clinical Question", "Review"];

export default function MultiStepPageComponent() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [clinicalQuestion, setClinicalQuestion] = useState<string>("");
  const [clinicalNotes, setClinicalNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [questionError, setQuestionError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionsResp>({
    assessment: {
      appropriate: false,
      missingKeyInfo: null,
      reason: null,
    },
    clinicalNotes: "",
    originalQuestion: "",
    suggestions: [],
  });
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(false);

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
  interface ApiResponse {
    specialistSummary: string;
    populatedTemplate: object[];
    specialistAIResponse: {
      summaryResponse: string;
      citations: string[];
    };
  }

  const handleTextQuery = async () => {
    if (!clinicalQuestion.trim() || !clinicalNotes.trim()) {
      alert("Both Clinical Question and Clinical Notes are required.");
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const endpoint = "https://suggestionsai-backend.onrender.com/suggestions";
      const payload = {
        clinicalQuestion: clinicalQuestion,
        clinicalNotes: clinicalNotes,
      };

      const response = await postData<SuggestionsResp>(endpoint, payload);
      if (response) {
        setSuggestions(response);
      } else {
        alert("Failed to get a valid response from the API.");
      }
    } catch (error) {
      console.error("Error querying the API:", error);
      alert("Failed to get a response from the API.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  async function handleSubmit() {
    setIsLoading(true);
    // setClinicalQuestion(clinicalQuestion);
    try {
      const requestBody = {
        question: clinicalQuestion,
        clinicalNotes: clinicalNotes,
      };
      const response = await postData<ApiResponse | null>(
        "https://assist-pc-backend.onrender.com/referral",
        requestBody
      );
      setApiResponse(response);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (!clinicalQuestion.trim() || !clinicalNotes.trim()) {
        setQuestionError("Clinical question is required.");
        setNotesError("Clinical notes are required.");
        return;
      }
      if (clinicalQuestion.trim().split(" ").length < 5) {
        setQuestionError("Clinical question must be at least 5 words long.");
        return;
      }
      if (clinicalNotes.trim().split(" ").length < 5) {
        setNotesError("Clinical notes must be at least 5 words long.");
        return;
      }
      handleSubmit();
    }
    setActiveStep((prev) => prev + 1);
  };


  return (
    <Box sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {activeStep === 0 ? (
          <ClinicalQuestionPage
            questionError={questionError}
            notesError={notesError}
            setNotesError={setNotesError}
            setQuestionError={setQuestionError}
            setClinicalQuestion={setClinicalQuestion}
            setClinicalNotes={setClinicalNotes}
            data={suggestions}
          />
        ) : isLoading ? (
          <LoadingPage />
        ) : (
          <ConsultPage response={apiResponse} />
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        {activeStep === 0 && (
          <Button
            variant="contained"
            color="success"
            sx={{ bgcolor: "green" }}
            onClick={handleTextQuery}
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions ? (
              <CircularProgress size={24} />
            ) : (
              "Get Suggestions"
            )}
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
          {activeStep === steps.length - 1 ? (
            <Button variant="contained">
              Submit
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Generate Report
            </Button>
          )}
      </Box>
    </Box>
  );
}
