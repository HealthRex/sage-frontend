import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress} from "@mui/material";
import ConsultPage from'./ConsultPage';

const LoadingPage = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Call the callback to switch the page
    }, 1000); // Loading time of 1 seconds
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
<ConsultPage/>
// Main App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false); 
  };

  return isLoading ? (
    <LoadingPage onComplete={handleLoadingComplete} />
  ) : (
    <ConsultPage />
  );
};

export default App;