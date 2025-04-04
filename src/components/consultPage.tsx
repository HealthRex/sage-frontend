"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Divider from '@mui/material/Divider';

interface ApiResponse {
  specialistSummary: string;
  populatedTemplate: object[];
  specialistAIResponse: {
    summaryResponse: string;
    citations: string[];
  };
}

interface ConsultPageProps {
  response: ApiResponse | null;
}
interface PhaseContent {
  heading: string;
  steps: string[];
}


const ConsultPage: React.FC<ConsultPageProps> = ({ response }) => {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPhase1, setShowPhase1] = useState<boolean>(true);
  const [showPhase2, setShowPhase2] = useState<boolean>(false);
  const [showPhase3, setShowPhase3] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [displayedTemplate, setDisplayedTemplate] = useState<object[]>([]);
  const [typedSpecialistSummary, setTypedSpecialistSummary] =
    useState<string>("");
  const [typedCitations, setTypedCitations] = useState<string[]>([]);

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

  useEffect(() => {
    if (response && response.specialistAIResponse?.summaryResponse) {
      const words = response.specialistAIResponse.summaryResponse.split(" "); // Split text into words
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText((prev) =>
            prev ? prev + " " + words[currentIndex] : words[currentIndex]
          ); // Append word by word
          currentIndex++;
        } else {
          clearInterval(interval);

          // Move startTypingCitations function here
          if (response.specialistAIResponse?.citations) {
            const citations = response.specialistAIResponse.citations;
            let citationIndex = 0;

            const citationInterval = setInterval(() => {
              if (citationIndex < citations.length) {
                setTypedCitations((prev) => [...prev, citations[citationIndex]]);
                citationIndex++;
              } else {
                clearInterval(citationInterval);
              }
            }, 400); // Adjust delay for smoother citation-by-citation effect
          }
        }
      }, 60); // Adjust delay for faster word-by-word effect

      return () => clearInterval(interval);
    }
  }, [response?.specialistAIResponse?.summaryResponse, response?.specialistAIResponse?.citations]);

  useEffect(() => {
    if (response && response.specialistSummary) {
      const text = response.specialistSummary;
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypedSpecialistSummary((prev) => prev + text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 3); // Adjust delay for smoother character-by-character effect

      return () => clearInterval(interval);
    }
  }, [response?.specialistSummary]);

  useEffect(() => {
    if (response && response.populatedTemplate) {
      const templateItems = response.populatedTemplate;
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < templateItems.length) {
          setDisplayedTemplate((prev) => [
            ...prev,
            templateItems[currentIndex],
          ]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 400); // Adjust delay for smoother item-by-item effect

      return () => clearInterval(interval);
    }
  }, [response?.populatedTemplate]);

  const getPhaseContent = (phaseNumber: 1 | 2 | 3): PhaseContent => {
    switch (phaseNumber) {
      case 1:
        return {
          heading: "Analyzing question and selecting appropriate specialty...",
          steps: [
            "Reviewing clinical question and patient context...",
            "Identifying key clinical parameters in question...",
            "Determining optimal specialty consultation...",
          ],
        };
      case 2:
        return {
          heading: "Automatically retrieving and organizing patient data...",
          steps: [
            "Scanning clinical notes for relevant information...",
            "Extracting key labs, medications, and diagnostic studies...",
            "Organizing critical information for specialist review...",
          ],
        };
      case 3:
        return {
          heading: "Generating evidence-based recommendations...",
          steps: [
            "Analyzing clinical question and abstracted patient data...",
            "Consulting trusted clinical guidelines and resources...",
            "Formulating recommendations with supporting citations...",
          ],
        };
      default:
        return { heading: "", steps: [] };
    }
  };

  const currentPhaseContent: PhaseContent = getPhaseContent(phase);

  const renderWithCitations = (
    text: string,
    specialistAIResponse: { citations: string[] }
  ) => {
    const lineToRemove = "Sure, let's address the question step by step.";
    const cleanedText = text.replace(new RegExp(lineToRemove, "g"), ""); // Remove the specified line
    return cleanedText.replace(
      /\[([0-9]+)\]\(#ref-[a-zA-Z0-9]+\)/g,
      (match, index) => {
        const citationIndex = parseInt(index, 10) - 1;
        const citation = specialistAIResponse.citations[citationIndex];
        return citation ? `[${index}](${citation})` : match;
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "auto",
        opacity: 1,
        height: "auto",
        transition: "opacity 0.5s ease-out, height 0.5s ease-out",
      }}
    >
      {/* Left Side (Lab Data & History) */}
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#f9f9f9",
          borderRight: "1px solid #ddd",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {response ? (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Auto-populated Data
              </Typography>
              <Paper elevation={3} sx={{ p: 1 }}>
                <List>
                  {displayedTemplate.map((item, index) => (
                    <ListItem
                      key={index}
                      divider
                      sx={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease-out ${
                          index * 0.15
                        }s forwards`, // Add delay for each item
                        "@keyframes fadeIn": {
                          from: { opacity: 0 },
                          to: { opacity: 1 },
                        },
                      }}
                    >
                      {item && // Ensure item is not null or undefined
                        Object.entries(item).map(([key, value]) => (
                          <ListItemText
                            key={key}
                            primary={
                              <span
                                style={{
                                  display: "block",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                {key}
                              </span>
                            }
                            secondary={
                              typeof value === "string" &&
                              value.includes("\n") ? (
                                <span
                                  style={{
                                    margin: 0,
                                    paddingLeft: "1.5rem",
                                    listStyleType: "none",
                                  }}
                                >
                                  {value.split("\n").map((line, i) => (
                                    <span key={i}>
                                      {line.includes(":") ? (
                                        <>
                                          <strong>{line.split(":")[0]}</strong>
                                          {line.slice(line.indexOf(":"))}
                                        </>
                                      ) : (
                                        line
                                      )}
                                    </span>
                                  ))}
                                </span>
                              ) : value &&
                                typeof value === "string" &&
                                value.includes(":") ? (
                                <>
                                  <strong>{value.split(":")[0]}</strong>
                                  {value.slice(value.indexOf(":"))}
                                </>
                              ) : (
                                value || "N/A"
                              )
                            }
                          />
                        ))}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  animation: "fadeGlow 2s infinite",
                }}
              >
                Loading...
              </Typography>
              {[...Array(1)].map((_, index) => (
                <React.Fragment key={index}>
                  <Typography variant="h6" gutterBottom>
                    {currentPhaseContent.heading}
                  </Typography>
                  {(showPhase1 || showPhase2 || showPhase3) && (
                    <Box textAlign="left" sx={{ minHeight: 80 }}>
                      {currentPhaseContent.steps
                        .slice(0, step)
                        .map((stepText, index) => (
                          <Typography key={index} variant="body1">
                            {stepText}
                          </Typography>
                        ))}
                    </Box>
                  )}
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </React.Fragment>
              ))}
            </>
          )}
        </Box>
      </Box>
      {/* Right Side (AI-Generated Response) */}
      <Box sx={{ p: 2, pt: 0.1, mb: 3, boxShadow: 0, width: "50%" }}>
        {response ? (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Specialist Summary
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{
                mb: 2,
                whiteSpace: "pre-wrap", // Preserve line breaks
              }}
            >
              {typedSpecialistSummary}
            </Typography>
          </Paper>
        ) : (
          <>
            <Skeleton variant="text" width="55%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2}} />
          </>
        )}
        {response && response.specialistAIResponse ? (
          <>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 0,
                transition: "all 0.5s ease-in-out", // Smooth transition for height and opacity
                opacity: displayedText ? 1 : 0, // Fade in when text is displayed
                height: displayedText ? "auto" : 0, // Adjust height dynamically
                overflow: "hidden", // Prevent content overflow during transition
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                AI Generated Response
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ mb: 2 }}
                className="specialist-response"
              >
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={
                          href?.startsWith("http") ? href : `https://${href}`
                        }
                        style={{ color: "blue", textDecoration: "underline" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {renderWithCitations(displayedText, {
                    citations: response.specialistAIResponse.citations,
                  })}
                </ReactMarkdown>
              </Typography>
            </Paper>
            {response.specialistAIResponse && typedCitations.length > 0 && (
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                  Quick References
                </Typography>
                <List sx={{ listStyleType: "disc", pl: 2 }}>
                  {typedCitations.map((line, index) => (
                    line ? ( // Ensure line is not undefined or null
                      <Link key={index} href={line}>
                        <ListItem
                          sx={{
                            display: "list-item",
                            p: 0.3,
                            pl: 0,
                            color: "blue",
                            textDecoration: "underline",
                            opacity: 0,
                            animation: `fadeIn 0.5s ease-in ${index * 0.2}s forwards`, // Smooth fade-in for each citation
                            "@keyframes fadeIn": {
                              from: { opacity: 0 },
                              to: { opacity: 1 },
                            },
                          }}
                        >
                          <ListItemText primary={line} />
                        </ListItem>
                      </Link>
                    ) : null // Skip rendering if line is invalid
                  ))}
                </List>
              </Paper>
            )}
          </>
        ) : (
          <>
            <Divider sx={{ mb: 2, mt: 4}} />
            <Skeleton variant="text" width="50%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2}} />
            <Divider sx={{ mb: 2}} />
            <Skeleton variant="text" width="50%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default ConsultPage;
