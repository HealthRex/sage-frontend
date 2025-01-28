import React, { useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const specialties = [
  { name: "Infectious Disease", response: "24-48 hours" },
  { name: "Endocrinology", response: "24-72 hours" },
  { name: "Haematology", response: "24-48 hours" },
];

const SelectSpecialtyPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const handleClick = (index) => {
    setSelectedSpecialty(index); // Update the selected button
  };

  return (
    <Box
      sx={{
        p: 2, // Adjusted padding
        display: "flex",
        flexDirection: "column",
        alignItems: "left", // Center-aligns content
        width: "100%", // Full width of the container
      }}
    >
      <Typography variant="h6" alignItems="left" sx={{ mb: 2, fontWeight: "bold" }}>
        Select Specialty
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {specialties.map((specialty, index) => (
          <Grid
            item
            xs={12} // Full width on mobile
            sm={6} // Half width on small screens
            md={4} // One-third width on medium screens
            key={index}
          >
            <Paper
              onClick={() => handleClick(index)}
              sx={{
                p: 2, // Padding inside the button
                textAlign: "center",
                cursor: "pointer",
                backgroundColor:
                  selectedSpecialty === index ? "primary.main" : "background.paper",
                color: selectedSpecialty === index ? "white" : "text.primary",
                height: "100px", // Adjusted height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)", // Slightly smaller shadow
                "&:hover": {
                  backgroundColor:
                    selectedSpecialty === index
                      ? "primary.main"
                      : "grey.200", // Hover color for non-selected buttons
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {specialty.name}
              </Typography>
              <Typography variant="body2">{specialty.response}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SelectSpecialtyPage;
