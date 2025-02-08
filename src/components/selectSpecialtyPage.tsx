"use client";

import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

interface Specialty {
  name: string;
  response: string;
}

const specialties: Specialty[] = [
  { name: "Infectious Disease", response: "24-48 hours" },
  { name: "Endocrinology", response: "24-72 hours" },
  { name: "Haematology", response: "24-48 hours" },
];


  export default function SelectSpecialtyPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "left", width: "100%" }}
      >
        Select Specialty
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          width: "100%",
        }}
      >
        {specialties.map((specialty, index) => (
          <Paper
            key={index}
            onClick={() => setSelectedSpecialty(index)}
            sx={{
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor:
                selectedSpecialty === index ? "primary.main" : "background.paper",
              color: selectedSpecialty === index ? "white" : "text.primary",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "calc(30% - 16px)",
              minWidth: "200px",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor:
                  selectedSpecialty === index ? "primary.main" : "grey.200",
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {specialty.name}
            </Typography>
            <Typography variant="body2">{specialty.response}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
