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
import EventSourceStream from '@server-sent-stream/web';

const steps = ["Clinical Question", "Review"];

export default function MultiStepPageComponent() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [clinicalQuestion, setClinicalQuestion] = useState<string>("");
  const [clinicalNotes, setClinicalNotes] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [questionError, setQuestionError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [loading, setLoading] = useState<boolean>(false); // New loading state

  interface ApiResponse {
    specialistSummary: string;
    populatedTemplate: Array<{ field: string; value: string }>;
    specialistAIResponse: {
      summaryResponse: string;
      citations:  Array<{ name: string; url: string }>;
    };
  }

  

  async function handleSubmit(requestBody: { question: string; clinicalNotes: string }) {
    setApiResponse(null);
    setLoading(true); // Set loading to true when starting the request

    try {
        console.log("Request Body:", requestBody);
        const response = await fetch("https://assist-pc-backend-dev.onrender.com/referral-streamed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok || !response.body) {
            throw new Error("Network response was not ok or body is null");
        }

        const stream = response.body;
        const decoder = new EventSourceStream();
        stream.pipeThrough(decoder);

        // Read from the EventSourceStream
        const reader = decoder.readable.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done || value.data == null) break;

            const jsonStr = value.data;
            try {
                const parsed = JSON.parse(jsonStr);
                setApiResponse((prev) => ({
                    ...(prev || {}),
                    ...parsed,
                }));
            } catch (err) {
                console.warn("Invalid JSON in data:", err);
                console.warn("Invalid JSON: ", jsonStr);
            }
        }
    } catch (error) {
        console.error("Error during streaming:", error);
    } finally {
        setLoading(false); // Set loading to false after all chunks are received
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
      const requestBody = {
        question: clinicalQuestion,
        clinicalNotes: clinicalNotes,
    };
      handleSubmit(requestBody);
    }
    setActiveStep((prev) => prev + 1);
  };


  return (
    <Box sx={{ p: 2, pb:0, pt:1}}>
      <Stepper activeStep={activeStep} sx={{ mb: "10px" }}>
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
          <ConsultPage response={apiResponse} clinicalQuestion={clinicalQuestion} clinicalNotes={clinicalNotes} barLoading={loading} onSubmit={handleSubmit} />
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
          {activeStep === steps.length - 1 ? (
           null
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Generate Report
            </Button>
          )}
      </Box>
    </Box>
  );
}
