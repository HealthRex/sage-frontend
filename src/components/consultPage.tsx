"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import Divider from "@mui/material/Divider";
import { FollowUpQuestions, SearchBar } from "./searchBar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useMemo } from "react"; // Ensure useMemo is imported
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import DownloadIcon from "@mui/icons-material/Download";
interface ApiResponse {
  specialistSummary: string;
  basicPatientSummary: Array<{
    field: string;
    value: string;
  }>;
  populatedTemplate: Array<Record<string, unknown>>; // Generic and flexible, avoids 'any'
  specialistAIResponse: {
    summaryResponse: string;
    citations: Array<{
      name: string;
      url: string;
    }>;
  };
}

interface ConsultPageProps {
  response: ApiResponse | null;
  clinicalQuestion: string;
  clinicalNotes: string;
  barLoading: boolean;
  onSubmit: (requestBody: { question: string; clinicalNotes: string }) => void; // Update type
}
interface PhaseContent {
  heading: string;
  steps: string[];
}

const ConsultPage: React.FC<ConsultPageProps> = ({
  barLoading,
  response,
  clinicalQuestion,
  onSubmit,
  clinicalNotes,
}) => {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPhase1, setShowPhase1] = useState<boolean>(true);
  const [showPhase2, setShowPhase2] = useState<boolean>(false);
  const [showPhase3, setShowPhase3] = useState<boolean>(false);
  const [displayedTemplate, setDisplayedTemplate] = useState<
    Array<{ field: string; value: string }>
  >([]);
  const [typedText, setTypedText] = useState<string>("");
  const [wordIndex, setWordIndex] = useState(0);
  const [citationIndex, setCitationIndex] = useState(0);
  const summaryWords =
    response?.specialistAIResponse?.summaryResponse?.split(" ") || "";
  const [showGeneratingText, setShowGeneratingText] = useState(false);
  const [botReply, setBotReply] = useState<
    Array<{
      from: string;
      text:
        | string
        | {
            summaryResponse: string;
            citations: Array<{ name: string; url: string }>;
          };
    }>
  >([]);
  const citations = useMemo(
    () =>
      response?.specialistAIResponse?.citations?.map(
        (citation) => citation.url
      ) || [],
    [response?.specialistAIResponse?.citations]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
const scrollToBottom = () => {
  if (containerRef.current) {
    const { scrollHeight, clientHeight } = containerRef.current;
    containerRef.current.scrollTop = scrollHeight - clientHeight - 10; // 10px above bottom
  } else {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
};

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= 400;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    if (botReply.length > 0 && botReply[botReply.length - 2]?.from === "user") {
      scrollToBottom(); // Automatically scroll to bottom when the last botReply message is from the user
    }
    // Ensure it runs only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botReply.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
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
    specialistAIResponse: { citations: Array<{ name: string; url: string }> }
  ) => {
    const lineToRemove = "Sure, let's address the question step by step.";
    const cleanedText = text.replace(new RegExp(lineToRemove, "g"), ""); // Remove the specified line
    return cleanedText.replace(
      /\[([0-9]+)\]\(#ref-[a-zA-Z0-9]+\)/g,
      (match, index) => {
        const citationIndex = parseInt(index, 10) - 1;
        const citation = specialistAIResponse.citations[citationIndex]?.url;
        return citation ? `[${index}](${citation})` : match;
      }
    );
  };
  const [editableClinicalQuestion, setEditableClinicalQuestion] =
    useState(clinicalQuestion);
  const [isEditing, setIsEditing] = useState(false);
  const [displayedClinicalQuestion, setDisplayedClinicalQuestion] =
    useState(clinicalQuestion); // State to show the updated question
  const [error, setError] = useState<string | null>(null); // State for error message
  const [aierror, setAiError] = useState<string | null>(null); // State for error message
  const [summaryerror, setSummaryError] = useState<string | null>(null); // State for error message
  const [resetTimeouts, setResetTimeouts] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleCancelClick = () => {
    setError(null);
    setIsEditing(false); // Disable edit mode
    setEditableClinicalQuestion(displayedClinicalQuestion); // Reset to the currently displayed value
  };

  const handleSaveClick = () => {
    const wordCount = editableClinicalQuestion.trim().split(/\s+/).length; // Count words
    if (wordCount < 3) {
      setError("The clinical question must contain at least 3 words."); // Set error message
      return; // Prevent saving
    }
    setError(null); // Clear error if validation passes
    setIsEditing(false); // Disable edit mode
    setDisplayedClinicalQuestion(editableClinicalQuestion); // Update the displayed question
    setBotReply([]); // Reset botReply to its default state
    setTypedText(""); // Clear the AI-generated response text
    setWordIndex(0); // Reset word index for typing animation
    setCitationIndex(0); // Reset citation index for typing animation
    setAiError(null); // Clear AI error message
    setSummaryError(null); // Clear summary error message
    const requestBody = {
      question: editableClinicalQuestion, // Use the updated clinicalQuestion
      clinicalNotes: clinicalNotes,
    };
    onSubmit(requestBody); // Call handleSubmit with the updated requestBody
    setResetTimeouts((prev) => !prev);
  };

  const calculateRows = (text: string) => {
    const maxWidth = 500; // Approximate width of the TextField in pixels
    const wordsPerLine = Math.floor(maxWidth / 6); // Approximate words per line
    const lines = Math.ceil(text.length / wordsPerLine);
    return Math.max(2, lines); // Minimum 2 rows
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!response?.specialistAIResponse) {
      timeout = setTimeout(() => {
        setAiError("Something went wrong. Please try again."); // Display error message
      }, 50000); // 1 minute timeout
    }

    return () => clearTimeout(timeout); // Cleanup timeout on unmount or response change
  }, [response?.specialistAIResponse, resetTimeouts]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!response?.specialistSummary) {
      timeout = setTimeout(() => {
        setSummaryError("Something went wrong. Please try again."); // Display error message
      }, 50000); // 1 minute timeout
    }

    return () => clearTimeout(timeout); // Cleanup timeout on unmount or response change
  }, [response?.specialistSummary, resetTimeouts]);

  type KeyValueData =
    | string
    | number
    | boolean
    | null
    | undefined
    | KeyValueObject
    | KeyValueData[];
  interface KeyValueObject {
    [key: string]: KeyValueData;
  }

  type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

type JSONArray = JSONValue[];

const [isEditingLeft, setIsEditingLeft] = useState(false);

const [editableTemplate, setEditableTemplate] = useState<Array<{ field: string; value: string }>>([]);

const [editablePopulatedTemplate, setEditablePopulatedTemplate] = useState<JSONValue[]>([]);
const [displayedPopulatedTemplate, setDisplayedPopulatedTemplate] = useState<JSONValue[]>([]);

useEffect(() => {
  if (response?.basicPatientSummary) {
    setDisplayedTemplate(response.basicPatientSummary);
    setEditableTemplate(response.basicPatientSummary.map(item => ({ ...item })));
  }
  if (response?.populatedTemplate) {
    setDisplayedPopulatedTemplate(response.populatedTemplate.map(item => ({ ...item })) as JSONValue[]);
    setEditablePopulatedTemplate(response.populatedTemplate.map(item => ({ ...item })) as JSONValue[]);
  }
}, [response?.basicPatientSummary, response?.populatedTemplate]);

const handleEditLeft = () => setIsEditingLeft(true);
const handleCancelLeft = () => {
  setEditableTemplate(displayedTemplate.map(item => ({ ...item })));
  setEditablePopulatedTemplate(
    displayedPopulatedTemplate.map(item =>
      typeof item === "object" && item !== null && !Array.isArray(item)
        ? { ...item }
        : item
    )
  );
  setIsEditingLeft(false);
};
const handleSaveLeft = () => {
  setDisplayedTemplate(editableTemplate.map(item => ({ ...item })));
  setDisplayedPopulatedTemplate(
    editablePopulatedTemplate.map(item =>
      typeof item === "object" && item !== null && !Array.isArray(item)
        ? { ...item }
        : item
    )
  );
  setIsEditingLeft(false);
};

function updateNestedValue(
  obj: JSONObject | JSONArray,
  path: (string | number)[],
  value: JSONValue
): void {
  if (path.length === 0) return;

  const [first, ...rest] = path;

  if (rest.length === 0) {
    if (Array.isArray(obj) && typeof first === "number") {
      obj[first] = value;
    } else if (!Array.isArray(obj) && typeof first === "string") {
      obj[first] = value;
    }
    return;
  }

  const next =
    Array.isArray(obj) && typeof first === "number"
      ? obj[first]
      : !Array.isArray(obj) && typeof first === "string"
      ? obj[first]
      : undefined;

  if (
    typeof next === "object" &&
    next !== null &&
    (Array.isArray(next) || typeof next === "object")
  ) {
    updateNestedValue(next as JSONObject | JSONArray, rest, value);
  }
}


const renderKeyValuePairs = (
  data: JSONValue,
  path: (string | number)[] = [],
  isEditing: boolean = false,
  setEditable?: (updater: (prev: JSONValue[]) => JSONValue[]) => void
): React.ReactNode => {
  if (Array.isArray(data)) {
    return (
      <List sx={{ pl: 0, pr: 0, m: 0, width: "100%" }}>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {renderKeyValuePairs(item, [...path, index], isEditing, setEditable)}
            {index < data.length - 1 && (
              <Divider sx={{ width: "100%", my: 0, borderColor: "#e0e0e0" }} />
            )}
          </React.Fragment>
        ))}
      </List>
    );
  }

  if (typeof data === "object" && data !== null) {
    const entries = Object.entries(data);

    return (
      <>
        {entries.map(([key, value], index) => {
          const currentPath = [...path, key];

          return (
            <React.Fragment key={`${key}-${index}`}>
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  opacity: 0,
                  transform: "translateY(10px)",
                  animation: `fadeIn 0.5s ease-in ${index * 0.2}s forwards`,
                  pl: path.length,
                  pr: 0,
                  m: 0,
                  width: "100%",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {key}:
                </Typography>

                {isEditing && (typeof value === "string" || typeof value === "number" || typeof value === "boolean") ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline={typeof value === "string"}
                    value={value ?? ""}
                    onChange={e => {
                      const newValue: JSONValue = typeof value === "number"
                        ? Number(e.target.value)
                        : typeof value === "boolean"
                        ? e.target.value === "true"
                        : e.target.value;

                      if (setEditable) {
                        setEditable(prev => {
                          const updated = JSON.parse(JSON.stringify(prev)) as JSONValue[];
                          updateNestedValue(updated, currentPath, newValue);
                          return updated;
                        });
                      }
                    }}
                    sx={{ mt: 1, mb: 1 }}
                  />
                ) : typeof value === "string" && value.includes("\n") ? (
                  <ReactMarkdown
                    components={{
                      div: ({ children }) => (
                        <Box
                          component="p"
                          sx={{
                            pl: 0,
                            pr: 0,
                            color: "grey.700",
                            display: "flex",
                            flexDirection: "column",
                            listStyleType: "none",
                            gap: "0.5rem",
                            width: "100%",
                            m: 0,
                          }}
                        >
                          {children}
                        </Box>
                      ),
                      p: ({ children }) => (
                        <Typography component="span" variant="body2">
                          {children}
                        </Typography>
                      ),
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                ) : typeof value === "string" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <Typography variant="body2" sx={{ color: "grey.800" }}>
                          {children}
                        </Typography>
                      ),
                    }}
                  >
                    {value || "N/A"}
                  </ReactMarkdown>
                ) : Array.isArray(value) || typeof value === "object" ? (
                  <List sx={{ width: "100%", pl: 0, pr: 0, m: 0 }}>
                    {renderKeyValuePairs(value, currentPath, isEditing, setEditable)}
                  </List>
                ) : (
                  <Typography variant="body2" sx={{ color: "grey.800" }}>
                    {String(value)}
                  </Typography>
                )}
              </ListItem>
              {index < entries.length - 1 && (
                <Divider sx={{ width: "100%", my: 0, borderColor: "#e0e0e0" }} />
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return (
    <ListItem
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pl: 0,
        pr: 0,
        m: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2" sx={{ color: "grey.800" }}>
        {String(data)}
      </Typography>
    </ListItem>
  );
};


const handleDownload = () => {
    const leftContent = document.getElementById('left-panel')?.innerHTML || '';
    const rightContent = document.getElementById('right-panel')?.innerHTML || '';
    const combinedContent = `
      <h1>Exported Content</h1>
      <h2>Left Panel</h2>
      ${leftContent}
      <h2>Right Panel</h2>
      ${rightContent}
    `;
    exportToWord(combinedContent);
  };

  function exportToWord(combinedContent: string) {
  // Create a complete HTML document for Word
  const html =
    `<html xmlns:o='urn:schemas-microsoft-com:office:office' ` +
    `xmlns:w='urn:schemas-microsoft-com:office:word' ` +
    `xmlns='http://www.w3.org/TR/REC-html40'>` +
    `<head><meta charset='utf-8'><title>Exported Content</title></head><body>${combinedContent}</body></html>`;

  // Create a Blob with the correct MIME type for Word
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword',
  });

  // Create a download link and trigger it
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'exported-content.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

  return (
    <Box
      sx={{
        display: "flex",
        opacity: 1,
        transition: "opacity 0.5s ease-out, height 0.5s ease-out",
      }}
    >
      {/* Left Side (Lab Data & History) */}

<Box
id="left-panel"
  sx={{
    width: "50%",
    borderRight: "1px solid #ddd",
    p: 2,
    paddingBottom: "2px",
    paddingTop: "0px",
  }}
>
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 0, m: 0 }}>
    {response ? (
      <>
        <Paper
          elevation={5}
          sx={{
            p: 2,
            m: 0,
            height: "calc(100vh - 122px)",
            maxHeight: "calc(100vh - 122px)",
            overflow: "hidden",
            overflowY: "auto",
            borderRadius: "10px",
            scrollbarWidth: "thin",
          }}
        >
         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", p: 0, m: 0, mb: 0 }}>
              Patient Information
            </Typography>
            {!isEditingLeft && (
              <>
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleEditLeft}
                  disabled={barLoading}
                >
                  <Tooltip title="Edit" arrow placement="top">
                    <EditNoteRoundedIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
                {/* Download Button */}
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleDownload}
                  disabled={barLoading}
                >
                  <Tooltip title="Download Report" arrow placement="top">
                    <DownloadIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
              </>
            )}
            {isEditingLeft && (
              <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveLeft}
                  sx={{ minWidth: 64 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelLeft}
                  sx={{ minWidth: 64 }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <List sx={{ p: 0, m: 0, mb: 3 }}>
            {(isEditingLeft ? editableTemplate : displayedTemplate).length > 1 ? (
              <>
                {/* First two items on one line */}
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  {(isEditingLeft ? editableTemplate : displayedTemplate).slice(0, 2).map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        opacity: 0,
                        px: 0,
                        m: 0,
                        pl: 2,
                        pt: 1,
                        pb: 1,
                        borderBottom: "1px solid #e0e0e0",
                        transform: "translateY(10px)",
                        animation: `fadeIn 0.5s ease-in ${index * 0.2}s forwards`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(10px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", p: 0, m: 0 }}
                      >
                        {item.field}:
                      </Typography>
                      {isEditingLeft ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          multiline
                          value={item.value}
                          onChange={e => {
                            const newValue = e.target.value;
                            setEditableTemplate(prev => {
                              const updated = [...prev];
                              updated[index] = { ...updated[index], value: newValue };
                              return updated;
                            });
                          }}
                          sx={{ mt: 1, mb: 1 }}
                        />
                      ) : (
                        typeof item.value === "string" && item.value.includes("\n") ? (
                          <ReactMarkdown
                            components={{
                              div: ({ children }) => (
                                <Box
                                  component="p"
                                  sx={{
                                    color: "grey.700",
                                    display: "flex",
                                    flexDirection: "column",
                                    listStyleType: "none",
                                    gap: "0.5rem",
                                    p: 0,
                                    m: 0,
                                  }}
                                >
                                  {children}
                                </Box>
                              ),
                              p: ({ children }) => (
                                <Typography component="span" variant="body2" sx={{ p: 0, m: 0 }}>
                                  {children}
                                </Typography>
                              ),
                            }}
                          >
                            {item.value}
                          </ReactMarkdown>
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <Typography
                                  variant="body2"
                                  sx={{ color: "grey.800", p: 0, m: 0 }}
                                >
                                  {children}
                                </Typography>
                              ),
                            }}
                          >
                            {item.value || "N/A"}
                          </ReactMarkdown>
                        )
                      )}
                    </ListItem>
                  ))}
                </Box>
                {/* Rest of the items, one per line */}
                {(isEditingLeft ? editableTemplate : displayedTemplate).slice(2).map((item, index) => (
                  <React.Fragment key={index + 2}>
                    <ListItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        opacity: 0,
                        px: 0,
                        m: 0,
                        pl: 2,
                        pt: 1,
                        pb: 1,
                        borderBottom: "1px solid #e0e0e0",
                        transform: "translateY(10px)",
                        animation: `fadeIn 0.5s ease-in ${(index + 2) * 0.2}s forwards`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(10px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", p: 0, m: 0 }}
                      >
                        {item.field}:
                      </Typography>
                      {isEditingLeft ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          multiline
                          value={item.value}
                          onChange={e => {
                            const newValue = e.target.value;
                            setEditableTemplate(prev => {
                              const updated = [...prev];
                              updated[index + 2] = { ...updated[index + 2], value: newValue };
                              return updated;
                            });
                          }}
                          sx={{ mt: 1, mb: 1 }}
                        />
                      ) : (
                        typeof item.value === "string" && item.value.includes("\n") ? (
                          <ReactMarkdown
                            components={{
                              div: ({ children }) => (
                                <Box
                                  component="p"
                                  sx={{
                                    color: "grey.700",
                                    display: "flex",
                                    flexDirection: "column",
                                    listStyleType: "none",
                                    gap: "0.5rem",
                                    p: 0,
                                    m: 0,
                                  }}
                                >
                                  {children}
                                </Box>
                              ),
                              p: ({ children }) => (
                                <Typography component="span" variant="body2" sx={{ p: 0, m: 0 }}>
                                  {children}
                                </Typography>
                              ),
                            }}
                          >
                            {item.value}
                          </ReactMarkdown>
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <Typography
                                  variant="body2"
                                  sx={{ color: "grey.800", p: 0, m: 0 }}
                                >
                                  {children}
                                </Typography>
                              ),
                            }}
                          >
                            {item.value || "N/A"}
                          </ReactMarkdown>
                        )
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </>
            ) : (
              // If only one item, render as before
              (isEditingLeft ? editableTemplate : displayedTemplate).map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      opacity: 0,
                      px: 0,
                      m: 0,
                      pl: 2,
                      pt: 1,
                      pb: 1,
                      borderBottom: "1px solid #e0e0e0",
                      transform: "translateY(10px)",
                      animation: `fadeIn 0.5s ease-in ${index * 0.2}s forwards`,
                      "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(10px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", p: 0, m: 0 }}
                    >
                      {item.field}:
                    </Typography>
                    {isEditingLeft ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        value={item.value}
                        onChange={e => {
                          const newValue = e.target.value;
                          setEditableTemplate(prev => {
                            const updated = [...prev];
                            updated[index] = { ...updated[index], value: newValue };
                            return updated;
                          });
                        }}
                        sx={{ mt: 1, mb: 1 }}
                      />
                    ) : (
                      typeof item.value === "string" && item.value.includes("\n") ? (
                        <ReactMarkdown
                          components={{
                            div: ({ children }) => (
                              <Box
                                component="p"
                                sx={{
                                  color: "grey.700",
                                  display: "flex",
                                  flexDirection: "column",
                                  listStyleType: "none",
                                  gap: "0.5rem",
                                  p: 0,
                                  m: 0,
                                }}
                              >
                                {children}
                              </Box>
                            ),
                            p: ({ children }) => (
                              <Typography component="span" variant="body2" sx={{ p: 0, m: 0 }}>
                                {children}
                              </Typography>
                            ),
                          }}
                        >
                          {item.value}
                        </ReactMarkdown>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <Typography
                                variant="body2"
                                sx={{ color: "grey.800", p: 0, m: 0 }}
                              >
                                {children}
                              </Typography>
                            ),
                          }}
                        >
                          {item.value || "N/A"}
                        </ReactMarkdown>
                      )
                    )}
                  </ListItem>
                </React.Fragment>
              ))
            )}
          </List>
          <Box sx={{ px: 0, pt: 0, m: 0, display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", p: 0, m: 0, mb: 2 }}>
              Template Information
            </Typography>
          </Box>
{isEditingLeft
  ? editablePopulatedTemplate.map((item, idx) => (
      <React.Fragment key={idx}>
        {renderKeyValuePairs(item, [idx], true, setEditablePopulatedTemplate)}
        {idx < editablePopulatedTemplate.length - 1 && <Divider />}
      </React.Fragment>
    ))
  : displayedPopulatedTemplate.map((item, idx) => (
      <React.Fragment key={idx}>
        {renderKeyValuePairs(item, [idx])}
        {idx < displayedPopulatedTemplate.length - 1 && <Divider />}
      </React.Fragment>
    ))}
        </Paper>
      </>
    ) : (
      // ...loading state as before...
      <>
        <Typography
          variant="h6"
          sx={{
            mb: 0,
            fontWeight: "bold",
            animation: "fadeGlow 2s infinite",
            px: 0,
            p: 0,
            m: 0,
          }}
        >
          Loading...
        </Typography>
        {[...Array(1)].map((_, index) => (
          <React.Fragment key={index}>
            <Typography variant="h6" gutterBottom sx={{ px: 0, p: 0, m: 0 }}>
              {currentPhaseContent.heading}
            </Typography>
            {(showPhase1 || showPhase2 || showPhase3) && (
              <Box textAlign="left" sx={{ minHeight: 80, px: 0, p: 0, m: 0 }}>
                {currentPhaseContent.steps
                  .slice(0, step)
                  .map((stepText, index) => (
                    <Typography key={index} variant="body1" sx={{ p: 0, m: 0 }}>
                      {stepText}
                    </Typography>
                  ))}
              </Box>
            )}
            <Skeleton variant="text" width="90%" height={20} sx={{ px: 0, p: 0, m: 0 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ px: 0, p: 0, m: 0 }} />
          </React.Fragment>
        ))}
      </>
    )}
  </Box>
</Box>
      {/* Right Side (AI-Generated Response) */}

      <Box
        ref={containerRef} // Attach the ref to the container
        id="right-panel"
        sx={{
          pl: 2,
          pr: 2,
          pt: 0.1,
          boxShadow: 0,
          width: "50%",
          height: "calc(100vh - 122px)", 
          maxHeight: "calc(100vh - 122px)", 
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {response ? (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Clinical Question
                </Typography>
                <IconButton
                  onClick={handleEditClick}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <Tooltip title="Edit" arrow placement="top">
                    <EditNoteRoundedIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
              </Box>

              {isEditing ? (
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={calculateRows(editableClinicalQuestion)} // Dynamically set rows
                  value={editableClinicalQuestion}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditableClinicalQuestion(value); // Update state on change
                    if (value.trim().split(/\s+/).length >= 3) {
                      setError(null); // Clear error if the input is valid
                    }
                  }}
                  error={!!error} // Show error state if there's an error
                  helperText={error} // Display the error message
                  sx={{
                    mb: 2,
                    fontSize: "0.9rem",
                    "& .MuiInputBase-input": {
                      fontSize: "0.9rem", // Match the font size of the original Typography
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.9rem",
                    wordWrap: "break-word",
                    flex: 1,
                    mb: 2,
                  }}
                >
                  {displayedClinicalQuestion}{" "}
                  {/* Show the updated clinical question */}
                </Typography>
              )}

              {isEditing && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveClick}
                    disabled={barLoading && typeof aierror != "string"}
                    sx={{ mb: 2 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleCancelClick}
                    sx={{ mb: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Specialist Summary
            </Typography>
            {response.specialistSummary ? (
              <Typography
                variant="body1"
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  position: "relative",
                  fontSize: "0.9rem",
                }}
              >
                {response.specialistSummary}
              </Typography>
            ) : summaryerror ? (
              <Typography
                variant="body1"
                sx={{ color: "red", fontWeight: "bold", mt: 2 }}
              >
                {summaryerror}
              </Typography>
            ) : (
              <>
                <Skeleton
                  variant="text"
                  width="90%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={20}
                  sx={{ mb: 1 }}
                />
              </>
            )}
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
        {aierror ? (
          <Typography
            variant="body1"
            sx={{ color: "red", fontWeight: "bold", mt: 2 }}
          >
            {aierror}
          </Typography>
        ) : response && response.specialistAIResponse ? (
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                marginBottom: "2px",
                transition: "all 0.5s ease-in-out",
                opacity: typedText ? 1 : 0,
                height: typedText ? "auto" : 0,
                overflow: "hidden",
                position: "relative", // Add for absolute button
              }}
              id="ai-generated-response-paper"
            >
              {/* Copy All Text Button */}
              <IconButton
                aria-label="Copy all text"
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  bgcolor: "transparent",
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
                onClick={() => {
                  // Copy the HTML content of the Paper (preserving formatting)
                  const paper = document.getElementById(
                    "ai-generated-response-paper"
                  );
                  if (paper) {
                    const html = paper.innerHTML;
                    // Use Clipboard API to copy as HTML
                    if (navigator.clipboard && window.ClipboardItem) {
                      const blob = new Blob([html], { type: "text/html" });
                      const item = new window.ClipboardItem({
                        "text/html": blob,
                      });
                      navigator.clipboard.write([item]);
                    } else {
                      // fallback: copy as plain text
                      navigator.clipboard.writeText(paper.innerText);
                    }
                  }
                }}
              >
                <Tooltip title="Copy response" arrow placement="top">
                  <ContentCopyIcon fontSize="small" />
                </Tooltip>
              </IconButton>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                AI Generated Response
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ mb: 2, fontSize: "0.9rem" }}
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
                    citations: response.specialistAIResponse.citations?.map(
                      (citation) => ({ name: citation.name, url: citation.url })
                    ),
                  })}
                </ReactMarkdown>
                {response.specialistAIResponse.citations && (
                  <>
                    {response.specialistAIResponse.citations.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          textAlign: 'start',
                          WebkitBoxFlex: 1,
                          flexGrow: 1,
                          margin: '12px 0px',
                          alignItems: 'center',
                        }}>
                        <svg
                          width="24" height="24"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2zm1-9h1V4H2v1h1zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2zm5-6v2h14V5zm0 14h14v-2H7zm0-6h14v-2H7z" />
                        </svg>
                        <Typography
                          variant="h6"
                          sx={{fontWeight: "bold" }}
                        >
                          References
                        </Typography>
                      </Box>
                    )}
                    <List
                      sx={{
                        p: 0,
                        pl: 2.5,
                        listStyle: "decimal",
                      }}
                    >
                      {response.specialistAIResponse.citations.map(
                        (citation, index) =>
                          citation.name ? ( // Ensure citation.name is not undefined or null
                            <ListItem
                              key={index}
                              component="a"
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: "list-item",
                                p: 0.2,
                                pl: 1,
                                color: "blue",
                                textDecoration: "underline",
                              }}
                            >
                              <ListItemText primary={citation.name} />
                            </ListItem>
                          ) : null // Skip rendering if citation.name is invalid
                      )}
                    </List>
                  </>
                )}
              </Typography>
            </Paper>
            {botReply.length > 0 && (
              <Paper
                sx={{ pt: 2, mt: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}
              >
                {botReply.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      mb: 1,
                      display: "flex",
                      justifyContent:
                        msg.from === "user" ? "flex-end" : "flex-start",
                    }}
                    // ref={idx === botReply.length - 2 ? messagesEndRef : null} // Scroll to the last message
                  >
                    <Box
                      sx={{
                        bgcolor: msg.from === "user" ? "#3aaefc" : "#fff",
                        color: msg.from === "user" ? "white" : "black",
                        px: 2,
                        py: 1,
                        borderRadius: "8px 0 0 8px",
                        maxWidth: msg.from === "user" ? "75%" : "100%",
                      }}
                    >
                      <Box whiteSpace="pre-line">
                        {msg.from === "user" ? (
                          <span>
                            {typeof msg.text === "string"
                              ? msg.text
                              : JSON.stringify(msg.text)}
                          </span>
                        ) : msg.text === "Loading" ? (
                          <Typography
                            variant="body1"
                            sx={{
                              mb: 2,
                              animation: "fadeGlow 2s infinite",
                            }}
                          >
                            Consulting trusted clinical guidelines and
                            resources...
                          </Typography>
                        ) : (
                          <>
                            <ReactMarkdown
                              components={{
                                a: ({ href, children }) => (
                                  <a
                                    href={
                                      href?.startsWith("http")
                                        ? href
                                        : `https://${href}`
                                    }
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {children}
                                  </a>
                                ),
                                strong: ({ children }) => (
                                  <span style={{ fontWeight: "bold" }}>
                                    {children}
                                  </span>
                                ),
                                ul: ({ children }) => (
                                  <span className="botReply">{children}</span>
                                ),
                                h3: ({ children }) => (
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "1.25rem",
                                      marginBottom: "1rem",
                                    }}
                                  >
                                    {children}
                                  </span>
                                ),
                              }}
                            >
                              {renderWithCitations(
                                typeof msg.text === "object" &&
                                  "summaryResponse" in msg.text
                                  ? msg.text.summaryResponse
                                  : msg.text,
                                {
                                  citations: (typeof msg.text === "object" &&
                                  "citations" in msg.text
                                    ? msg.text.citations
                                    : []
                                  )?.map((citation) => ({
                                    name: citation.name,
                                    url: citation.url,
                                  })),
                                }
                              )}
                            </ReactMarkdown>
                            {typeof msg.text === "object" &&
                              "citations" in msg.text &&
                              msg.text.citations.length > 0 && (
                                <>
                                  <Box
                                  sx={{
                                    display: 'flex',
                                    textAlign: 'start',
                                    WebkitBoxFlex: 1,
                                    flexGrow: 1,
                                    margin: '12px 0px',
                                    alignItems: 'center',
                                  }}>
                                     <svg
                                      width="24" height="24"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2zm1-9h1V4H2v1h1zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2zm5-6v2h14V5zm0 14h14v-2H7zm0-6h14v-2H7z" />
                                    </svg>
                                    <Typography
                                      variant="h6"
                                      sx={{fontWeight: "bold" }}
                                    >
                                      References
                                    </Typography>
                                  </Box>

                                  <List
                                    sx={{
                                      listStyleType: "disc",
                                      p: 0,
                                      pl: 3,
                                      listStyle: "decimal",
                                    }}
                                  >
                                    {msg.text.citations.map(
                                      (citation, citationIndex) => (
                                        <ListItem
                                          key={`${idx}-${citationIndex}`}
                                          component="a"
                                          href={citation.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{
                                            display: "list-item",
                                            p: 0.2,
                                            pl: 0,
                                            color: "blue",
                                            textDecoration: "underline",
                                            opacity: 0,
                                            animation: `fadeIn 0.5s ease-in ${
                                              citationIndex * 0.2
                                            }s forwards`,
                                            "@keyframes fadeIn": {
                                              from: { opacity: 0 },
                                              to: { opacity: 1 },
                                            },
                                          }}
                                        >
                                          <ListItemText
                                            primary={citation.name}
                                          />
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                </>
                              )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Paper>
            )}
            {!barLoading ? (
              <FollowUpQuestions
                barLoading={barLoading}
                onSuggestionClick={setSearchTerm}
              />
            ) : null}
            {!barLoading && showScrollButton && (
              <Button
                variant="contained"
                onClick={scrollToBottom}
                sx={{
                  mt: 2,
                  position: "sticky",
                  bottom: 63,
                  right: 0,
                  bgcolor: "#4C5FD5", // match that blue
                  color: "white",
                  borderRadius: "999px", // full pill shape
                  textTransform: "none", // keep normal casing
                  px: 2,
                  py: 0.5,
                  pl: 1.5,
                  fontWeight: "500",
                  fontSize: "0.7rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  "&:hover": {
                    bgcolor: "#3B4DB1",
                  },
                  margin: "auto",
                  opacity: 0.95,
                }}
              >
                <ArrowDownwardIcon sx={{ fontSize: 20 }} />
                Jump to bottom
              </Button>
            )}
            <div ref={messagesEndRef} />
            {!barLoading && (
              <Box
                sx={{
                  position: "sticky",
                  bottom: 0.5,
                  pb: 0,
                  zIndex: 10,
                  mt: 2,
                  borderRadius: "18px",
                }}
              >
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setBotReply={setBotReply}
                />
              </Box>
            )}
          </Box>
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
              <>{null}</>
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



