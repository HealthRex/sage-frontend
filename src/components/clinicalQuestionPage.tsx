"use client";

import { Box, TextField, Typography } from "@mui/material";
import React from "react";


export default function ClinicalQuestionPage() {
  return (
    <Box sx={{ alignItems: "flex-start", width: "100%" }}>
      <Typography
        variant="h6"
        align="left"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        Whats your clinical question?
      </Typography>
      <TextField
        label="Example: 52F with elevated TSH 8.2 on routine screening. No obvious symptoms. TPO antibodies positive. Should we start levothyroxine?"
        fullWidth
        multiline
        rows={4}
        placeholder="Example: 52F with elevated TSH 8.2 on routine screening. No obvious symptoms. TPO antibodies positive. Should we start levothyroxine?"
        sx={{ mb: 3 }}
      />
    </Box>
  );
};
