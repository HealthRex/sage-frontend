"use client"

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ClinicalQuestionPage from "./clinicalQuestionPage";
import SelectSpecialtyPage from "./selectSpecialtyPage";
import ConsultPage from "./consultPage";
import LoadingPage from "./loadingPage";

const steps = ["Clinical Question", "Select Specialty", "Review"];

export default function MultiStepPageComponent() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false); 
  };


  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ClinicalQuestionPage />;
      case 1:
        return <SelectSpecialtyPage />;
      case 2:
        return  isLoading ? <LoadingPage onComplete={handleLoadingComplete} /> : <ConsultPage />;
      default:
        return <Typography>Unknown step</Typography>;
    }
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

      <Box>{renderStepContent(activeStep)}</Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>

      {activeStep === steps.length && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      )}
    </Box>
  );
};
