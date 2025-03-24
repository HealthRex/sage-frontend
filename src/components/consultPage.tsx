"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

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

const ConsultPage: React.FC<ConsultPageProps> = ({ response }) => {
  if (!response) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", overflow: "auto" }}>
      {/* Left Side (Lab Data & History) */}
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#f9f9f9",
          borderRight: "1px solid #ddd",
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Auto-populated Data
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {response && (
            <Paper elevation={3} sx={{ p: 1 }}>
              <List>
                {response.populatedTemplate.map((item, index) => (
                  <ListItem key={index} divider>
                    {Object.entries(item).map(([key, value]) => (
                      <ListItemText
                        key={key}
                        primary={key}
                        secondary={value || "N/A"}
                      />
                    ))}
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Box>
      <Box sx={{ p: 2, pt: 0.1, mb: 3, boxShadow: 0, width: "50%" }}>
        {/* AI-Generated Response */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Specialist Summary
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            {response.specialistSummary}
          </Typography>
        </Paper>
        {/* AI Summary */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            AI Generated Response
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}  className="specialist-response" >
            <ReactMarkdown>
              {response.specialistAIResponse.summaryResponse}
            </ReactMarkdown>
          </Typography>
        </Paper>
        {response.specialistAIResponse.citations.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Quick References
          </Typography>
            <List sx={{ listStyleType: "disc", pl: 2 }}>
              {response.specialistAIResponse.citations.map(
                (line, index) => (
                  <Link key={index} href={line}>
                  <ListItem
                  sx={{ display: "list-item", p: 0.3, pl: 0 , color: "blue", textDecoration: "underline"}}
                >
                  <ListItemText primary={line} />
                </ListItem>
                 </Link>
                )
              )}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ConsultPage;
