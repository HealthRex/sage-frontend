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
import Divider from "@mui/material/Divider";

interface ApiResponse {
  specialistSummary: string;
  populatedTemplate: Array<{ field: string; value: string }>;
  specialistAIResponse: {
    summaryResponse: string;
    citations: string[];
  };
}

interface ConsultPageProps {
  response: ApiResponse | null;
  clinicalQuestion: string;
}
interface PhaseContent {
  heading: string;
  steps: string[];
}

const ConsultPage: React.FC<ConsultPageProps> = ({
  response,
  clinicalQuestion,
}) => {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPhase1, setShowPhase1] = useState<boolean>(true);
  const [showPhase2, setShowPhase2] = useState<boolean>(false);
  const [showPhase3, setShowPhase3] = useState<boolean>(false);
  const [displayedTemplate, setDisplayedTemplate] = useState<
    Array<{ field: string; value: string }>
  >([]);
  const [typedSpecialistSummary, setTypedSpecialistSummary] =
    useState<string>("");
  const [index, setIndex] = useState(0);
  const summaryText = response?.specialistSummary || "";
  const words = summaryText.split(" ");
  const [typedText, setTypedText] = useState<string>("");
  const [typedCitations, setTypedCitations] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [citationIndex, setCitationIndex] = useState(0);
  const summaryWords =
    response?.specialistAIResponse?.summaryResponse?.split(" ") || "";
  const citations = response?.specialistAIResponse?.citations || [];
  const [showGeneratingText, setShowGeneratingText] = useState(false);
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
    if (response?.populatedTemplate) {
      setDisplayedTemplate(response.populatedTemplate);
    }
  }, [response?.populatedTemplate]);

  useEffect(() => {
    if (!summaryText) return;

    if (index < words.length) {
      const timeout = setTimeout(() => {
        setTypedSpecialistSummary((prev) =>
          prev.length === 0 ? words[index] : `${prev} ${words[index]}`
        );
        setIndex((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [index, summaryText, words]);

  // Typing summaryResponse word-by-word
  useEffect(() => {
    if (wordIndex < summaryWords.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) =>
          prev.length === 0
            ? summaryWords[wordIndex]
            : `${prev} ${summaryWords[wordIndex]}`
        );
        setWordIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [wordIndex, summaryWords]);

  // Start typing citations after summary is fully typed
  useEffect(() => {
    if (wordIndex === summaryWords.length && citationIndex < citations.length) {
      const timeout = setTimeout(() => {
        setTypedCitations((prev) => [...prev, citations[citationIndex]]);
        setCitationIndex((prev) => prev + 1);
      }, 60 * 5); // a bit slower for links
      return () => clearTimeout(timeout);
    }
  }, [wordIndex, citationIndex, citations, summaryWords.length]);

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setShowGeneratingText(true);
      }, 3500); // Show after 5 seconds
      return () => clearTimeout(timer); // Cleanup timeout on unmount or response change
    } else {
      setShowGeneratingText(false); // Reset if no response
    }
  }, [response]);

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

  console.log("displayedTemplate:", displayedTemplate);

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
                    <React.Fragment key={index}>
                      <ListItem
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          opacity: 0,
                          transform: "translateY(10px)",
                          animation: `fadeIn 0.5s ease-in ${
                            index * 0.2
                          }s forwards`,
                          "@keyframes fadeIn": {
                            from: { opacity: 0, transform: "translateY(10px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {item.field}:
                        </Typography>
                        {typeof item.value === "string" &&
                        item.value.includes("\n") ? (
                          <Box component="ol" sx={{ pl: 2, color: "grey.700", paddingLeft: 0,
                            display: "flex",
                            flexDirection: "column",
                            listStyleType: "none",
                            gap: "0.5rem", }}>
                            {item.value.split("\n").map((line, idx) => (
                              <Typography
                                key={idx}
                                component="li"
                                variant="body2"
                              >
                                {line.trim()}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: "grey.700" }}
                          >
                            {item.value || "N/A"}
                          </Typography>
                        )}
                      </ListItem>
                      {index < displayedTemplate.length - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}{" "}
                      {/* Add Divider except after the last item */}
                    </React.Fragment>
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
              Clinical Question
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {clinicalQuestion}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Specialist Summary
            </Typography>
            {typedSpecialistSummary ? (<Typography
              variant="body1"
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                position: "relative",
              }}
            >
              {typedSpecialistSummary}
            </Typography>) :
            <>
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            </>
            }
            
          </Paper>
        ) : (
          <>
            <Skeleton variant="text" width="55%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
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
                opacity: typedText ? 1 : 0, // Fade in when text is displayed
                height: typedText ? "auto" : 0, // Adjust height dynamically
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
                  {renderWithCitations(typedText, {
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
                  {typedCitations.map(
                    (line, index) =>
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
                              animation: `fadeIn 0.5s ease-in ${
                                index * 0.2
                              }s forwards`, // Smooth fade-in for each citation
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
                  )}
                </List>
              </Paper>
            )}
          </>
        ) : (
          <>
              {response ? (
          <>
           <Divider sx={{ mb: 2, mt: 4 }} />
            {showGeneratingText && (
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  animation: "fadeGlow 2s infinite",
                }}
              >
                Generating evidence-based recommendations...
              </Typography>
            )}
          </>
        ) : (
          <>
           {null}
          </>
        )}
            <Skeleton variant="text" width="50%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />
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
