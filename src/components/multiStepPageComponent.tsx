"use client";

import React, { useState, useEffect } from "react";
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
  const [summaryAndTemplate, setSummaryAndTemplate] = useState<{
    specialistSummary: string;
    populatedTemplate: object[];
  } | null>(null);
  const [specialistAIResponse, setSpecialistAIResponse] = useState<{
    summaryResponse: string;
    citations: string[];
  } | null>(null);
  const [questionError, setQuestionError] = useState("");
  const [notesError, setNotesError] = useState("");

  const [delayedSummaryAndTemplate, setDelayedSummaryAndTemplate] = useState<{
    specialistSummary: string;
    populatedTemplate: object[];
  } | null>(null);

  const [delayedSpecialistAIResponse, setDelayedSpecialistAIResponse] = useState<{
    summaryResponse: string;
    citations: string[];
  } | null>(null);

  useEffect(() => {
    if (summaryAndTemplate) {
      const summaryTimer = setTimeout(() => {
        setDelayedSummaryAndTemplate(summaryAndTemplate);
      }, 12000); // 7 seconds delay
      return () => clearTimeout(summaryTimer);
    }
  }, [summaryAndTemplate]);

  useEffect(() => {
    if (specialistAIResponse) {
      const responseTimer = setTimeout(() => {
        setDelayedSpecialistAIResponse(specialistAIResponse);
      }, 23000); // 15 seconds delay
      return () => clearTimeout(responseTimer);
    }
  }, [specialistAIResponse]);


  async function handleSubmit() {
    try {
      // Use raw data directly
      const rawSpecialistSummary = "34-year-old female with no significant past medical history presenting with an 8-day history of fever (max 102.4F), sore throat, dry cough, myalgias, and fatigue. Exam reveals mild pharyngeal erythema. Initial workup includes normal WBC with normal differential, negative rapid strep, pending COVID-19 PCR, and clear chest X-ray. The primary concern is differentiating between a viral syndrome and an early bacterial infection.";
      const rawPopulatedTemplate = [
        { "Pharyngitis": "Pharyngitis" },
        { "Age": "34" },
        { "Sex": "Female" },
        { "Do you have a sore throat?": "Yes" },
        { "Do you have a fever?": "Yes" },
        { "What is the highest temperature you have recorded?": "102.4 F" },
        { "Do you have any difficulty swallowing?": "Not documented" },
        { "Do you have any pus on your tonsils?": "No" },
        { "Are you hoarse or have you lost your voice?": "Not documented" },
        { "Do you have a cough?": "Yes, dry cough" },
        { "Do you have a runny nose?": "No" },
        { "Do you have swollen lymph nodes in your neck?": "No" },
        { "Have you been around anyone who has strep throat or another illness?": "No known sick contacts" },
        { "Rapid Strep Test Result": "Negative" },
        { "COVID-19 PCR": "Pending" },
        { "White Blood Cell Count (WBC)": "5.4" },
      ];
      const rawSpecialistAIResponse = {
        summaryResponse: "In a 34-year-old female with pharyngitis, fever, and a dry cough, a negative rapid strep test, and pending COVID-19 PCR, the most likely diagnosis is a viral pharyngitis, possibly due to a common respiratory virus such as influenza or rhinovirus. \n\n---\n\n### Possible diagnoses\n\n- **Viral pharyngitis:** Most likely given the symptoms and negative rapid strep test [1](#ref-057ceae8).\n\n- **COVID-19:** Pending PCR; symptoms align with COVID-19 [2](#ref-89ae69f0).\n\n- **Influenza:** Considered due to fever and dry cough [3](#ref-f692bce7).\n\n- **Other respiratory viruses:** Such as rhinovirus or adenovirus [1](#ref-057ceae8).\n\n---\n\n### Diagnostic considerations\n\n- **Rapid strep test:** Negative, reducing likelihood of streptococcal pharyngitis [4](#ref-51429c16).\n\n- **Throat culture:** Not recommended after negative rapid test in adults [5](#ref-90b879e3).\n\n- **COVID-19 PCR:** Pending; important for diagnosis [6](#ref-1c89e5cb).\n\n- **Influenza testing:** Consider during flu season [3](#ref-f692bce7).\n\n---\n\n### Management\n\n- **Symptomatic treatment:** Focus on relieving symptoms.\n\n- **Antibiotics:** Not recommended given negative strep test and likely viral etiology [7](#ref-018dc243).\n\n- **Follow-up:** Important if symptoms persist or worsen.\n\n---\n\n### Other considerations\n\n- **Decreased lymphocyte count:** Could be due to viral infection such as COVID-19 or influenza [8](#ref-8b76606a).\n\n- **Increased WBC count:** Not present, reducing likelihood of bacterial infection [9](#ref-b1fb5fc6).\n\n---\n\nIn conclusion, the most likely diagnosis is viral pharyngitis, possibly due to COVID-19 or another respiratory virus. Management should focus on symptomatic treatment, and further testing should be guided by the pending COVID-19 PCR result.",
        citations: [
          "https://pubmed.ncbi.nlm.nih.gov/17561078",
          "https://pathway.md/diseases/rec2UFiNfrEGXdLl0",
          "https://pubmed.ncbi.nlm.nih.gov/32497279",
          "https://pathway.md/findings/blood-lymphocyte-count-decreased-recRmR6AsvZpZzbSA",
          "https://pathway.md/findings/recdpnfE5OoYVCd9F",
        ],
      };

      // Set states for summary/template and AI response
      setSummaryAndTemplate({
        specialistSummary: rawSpecialistSummary,
        populatedTemplate: rawPopulatedTemplate,
      });
      setSpecialistAIResponse(rawSpecialistAIResponse);
    } catch (error) {
      console.error("Error processing data:", error);
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
          <ConsultPage
            summaryAndTemplate={delayedSummaryAndTemplate}
            specialistAIResponse={delayedSpecialistAIResponse}
          />
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
