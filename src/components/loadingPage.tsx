"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Backdrop } from "@mui/material";

interface LoadingPageProps {
  message?: string; // Optional message
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message }) => {
  const [dynamicMessage, setDynamicMessage] = useState("Analysing notes and templates...");

  useEffect(() => {
    const timers = [
      setTimeout(() => setDynamicMessage("Analysing clinical question..."), 6000),
      setTimeout(
        () => setDynamicMessage("Gathering relevant clinical data and generating recommendations..."),
        13000
      ),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

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
          minWidth: 450,
        }}
      >
        <CircularProgress color="inherit" sx={{ mb: 2 }} />
        <Typography variant="h6">Preparing Your E-Consult</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {message || dynamicMessage}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingPage;
