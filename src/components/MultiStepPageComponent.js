import React from "react";
import { Box, Button, Typography, Stepper, Step, StepLabel } from "@mui/material";
import SelectSpecialtyPage from "./SelectSpecialtyPage";
import LoadingPage from "./LoadingPage";
import EConsultPage from "./ConsultPage";
import ClinicalQuestionPage from "./ClinicalQuestionPage";

// Define the steps for the Stepper
const steps = ["Clinical Question", "Select Specialty", "Review"];

const MultiStepPageComponent = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  // Handlers for navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Render content dynamically based on the current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ClinicalQuestionPage />;
      case 1:
        return <SelectSpecialtyPage />;
      case 2:
        return <LoadingPage />;
        case 3:
        return <EConsultPage />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {activeStep === 3 ? (
        <LoadingPage />
      ) : (
        <>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step
                key={label}
                sx={{
                  "& .MuiStepLabel-label.Mui-completed": { color: "green" },
                  "& .MuiStepIcon-root.Mui-completed": { color: "green" },
                  flex: 1, // Ensures equal spacing for all steps
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Finish
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                {activeStep === 1 ? "Generate E-Consult" : "Next"}
              </Button>
            )}
          </Box>

          {/* Optional Reset Button */}
          {activeStep === steps.length && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default MultiStepPageComponent;

