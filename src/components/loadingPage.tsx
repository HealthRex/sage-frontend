"use client";

import React, { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

interface LoadingPageProps {
  onComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Call the callback to switch the page
    }, 1000); // Loading time of 1 second
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "25vh",
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Preparing Your E-Consult</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Gathering relevant clinical data and generating recommendations...
      </Typography>
    </Box>
  );
};

export default LoadingPage;