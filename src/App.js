import React from "react";
import { Box, Container } from "@mui/material";
import MultiStepPageComponent from "./components/MultiStepPageComponent";
import Header from "./components/Header/header";
import FooterNote from "./components/FooterNote/footerNote";

const App = () => {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh", 
    }}
  >
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 4,
          marginBottom: 4,
          flex: 1, 
          display: "flex",
          justifyContent: "center",
          padding: "0 0"
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <MultiStepPageComponent />
        </Box>
      </Container>
      <FooterNote />
      </Box>
  );
};

export default App;
