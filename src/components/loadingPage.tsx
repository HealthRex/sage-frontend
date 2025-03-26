"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Backdrop } from "@mui/material";

interface LoadingPageProps {
  message?: string; // Optional message
}

interface PhaseContent {
  heading: string;
  steps: string[];
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message }) => {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPhase1, setShowPhase1] = useState<boolean>(true);
  const [showPhase2, setShowPhase2] = useState<boolean>(false);
  const [showPhase3, setShowPhase3] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === 1 || phase === 2 || phase === 3) {
      if (step < 3) {
        timer = setTimeout(() => {
          setStep((prevStep) => (prevStep + 1) as 1 | 2 | 3);
        }, 2500);
      } else {
        if (phase === 1) {
          timer = setTimeout(() => {
            setPhase(2);
            setStep(1);
            setShowPhase1(false);
            setShowPhase2(true);
          }, 3500);
        } else if (phase === 2) {
          timer = setTimeout(() => {
            setPhase(3);
            setStep(1);
            setShowPhase2(false);
            setShowPhase3(true);
          }, 3500);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [phase, step]);

  const getPhaseContent = (phaseNumber: 1 | 2 | 3, stepNumber: 1 | 2 | 3): PhaseContent => {
    switch (phaseNumber) {
      case 1:
        return {
          heading: 'Analyzing question and selecting appropriate specialty...',
          steps: [
            'Reviewing clinical question and patient context...',
            'Identifying key clinical parameters in question...',
            'Determining optimal specialty consultation...',
          ],
        };
      case 2:
        return {
          heading: 'Automatically retrieving and organizing patient data...',
          steps: [
            'Scanning clinical notes for relevant information...',
            'Extracting key labs, medications, and diagnostic studies...',
            'Organizing critical information for specialist review...',
          ],
        };
      case 3:
        return {
          heading: 'Generating evidence-based recommendations...',
          steps: [
            'Analyzing clinical question and abstracted patient data...',
            'Consulting trusted clinical guidelines and resources...',
            'Formulating recommendations with supporting citations...',
          ],
        };
      default:
        return { heading: '', steps: [] };
    }
  };

  const currentPhaseContent: PhaseContent = getPhaseContent(phase, step);

  return (
    <Backdrop open={true} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 3,
          bgcolor: "rgba(0, 0, 0, 0.75)",
          borderRadius: 2,
          width: 600,
          minHeight: 400,
          margin: 2,
        }}
      >
        <CircularProgress color="inherit" sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
            {currentPhaseContent.heading}
          </Typography>
        {(showPhase1 || showPhase2 || showPhase3) && (
        <Box textAlign="center" sx={{ minHeight: 110, }}>
          {currentPhaseContent.steps.slice(0, step).map((stepText, index) => (
            <Typography key={index} variant="body1">
              {stepText}
            </Typography>
          ))}
        </Box>
      )}
      </Box>
    </Backdrop>
  );
};

export default LoadingPage;


