"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ClinicalQuestionPage from "./clinicalQuestionPage";
import ConsultPage from "./consultPage";

const steps = ["Clinical Question", "Review"];

export default function MultiStepPageComponent() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [clinicalQuestion, setClinicalQuestion] = useState<string>("");
  const [clinicalNotes, setClinicalNotes] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [questionError, setQuestionError] = useState("");
  const [notesError, setNotesError] = useState("");

  interface ApiResponse {
    specialistSummary: string;
    populatedTemplate: Array<{ field: string; value: string }>
    specialistAIResponse: {
      summaryResponse: string;
      citations: string[];
    };
  }



  async function handleSubmit() {
    setApiResponse(null);
  
    try {
      const requestBody = {
        question: clinicalQuestion,
        clinicalNotes: clinicalNotes,
      };
  
      const response = await fetch("https://assist-pc-backend.onrender.com/referral-streamed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok or body is null");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialChunk = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        partialChunk += decoder.decode(value, { stream: true });
  
        // Process full SSE event blocks
        const events = partialChunk.split("\n\n"); // SSE events are often separated by double newlines
        for (const event of events) {
          const lines = event.split("\n");
          for (const line of lines) {
            if (line.startsWith("data:")) {
              const jsonStr = line.slice(5).trim(); // Remove "data:" prefix
              try {
                const parsed = JSON.parse(jsonStr);
                setApiResponse((prev) => ({
                  ...(prev || {}),
                  ...parsed,
                }));
              } catch (err) {
                console.warn("Invalid JSON in data:", err);
              }
            }
          }
        }
  
        // Reset chunk for next batch
        partialChunk = "";
      }
  
    } catch (error) {
      console.error("Error during streaming:", error);
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
          />
        ) : (
          <ConsultPage response={apiResponse} clinicalQuestion={clinicalQuestion} />
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
