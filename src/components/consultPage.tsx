"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
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
    suggestedLabOrders: string[];
    suggestedImaging: string[];
    suggestedMedications: string[];
  };
}

interface ConsultPageProps {
  response: ApiResponse | null;
}

const ConsultPage: React.FC<ConsultPageProps> = ({ response }) => {
  if (!response) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Fetching E-Consult Data...</Typography>
      </Box>
    );
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

        {/* Suggested Lab Orders */}
        {Array.isArray(response.specialistAIResponse.suggestedLabOrders) && response.specialistAIResponse.suggestedLabOrders.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
              Suggested Lab Orders
            </Typography>
            <List sx={{ listStyleType: "disc", pl: 2 }}>
              {response.specialistAIResponse.suggestedLabOrders.map(
                (line, index) => (
                  <ListItem
                    key={index}
                    sx={{ display: "list-item", p: 0.3, pl: 0 }}
                  >
                    <ListItemText primary={line} />
                  </ListItem>
                )
              )}
            </List>
          </Paper>
        )}
        {/* Suggested Imaging */}
        {response.specialistAIResponse.suggestedImaging.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
              Suggested Imaging
            </Typography>
            <List sx={{ listStyleType: "disc", pl: 2 }}>
              {response.specialistAIResponse.suggestedImaging.map(
                (line, index) => (
                  <ListItem
                    key={index}
                    sx={{ display: "list-item", p: 0.3, pl: 0 }}
                  >
                    <ListItemText primary={line} />
                  </ListItem>
                )
              )}
            </List>
          </Paper>
        )}

        {/* Suggested Medications */}
        {response.specialistAIResponse.suggestedMedications.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
              Suggested Medications
            </Typography>
            <List sx={{ listStyleType: "disc", pl: 2 }}>
              {response.specialistAIResponse.suggestedMedications.map(
                (line, index) => (
                  <ListItem
                    key={index}
                    sx={{ display: "list-item", p: 0.3, pl: 0 }}
                  >
                    <ListItemText primary={line} />
                  </ListItem>
                )
              )}
            </List>
          </Paper>
        )}
        {/* AI Summary */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            AI Summary
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <ReactMarkdown>
              {response.specialistAIResponse.summaryResponse}
            </ReactMarkdown>
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Quick References
          </Typography>
          <Typography variant="body2">
            <Link href="#">
            ATA Guidelines: Subclinical Hypothyroidism
          </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConsultPage;
