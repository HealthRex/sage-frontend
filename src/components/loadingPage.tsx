"use client";

import React from "react";
import { Box, Typography, CircularProgress, Backdrop } from "@mui/material";

interface LoadingPageProps {
  message?: string; // Optional message
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message }) => {
  return (
    <Backdrop open={true} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 3,
          bgcolor: "rgba(0, 0, 0, 0.75)",
          borderRadius: 2,
        }}
      >
        <CircularProgress color="inherit" sx={{ mb: 2 }} />
        <Typography variant="h6">Preparing Your E-Consult</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {message || "Gathering relevant clinical data and generating recommendations..."}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingPage;
