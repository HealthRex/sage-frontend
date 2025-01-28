import React from "react";
import { AppBar, Toolbar, Container } from "@mui/material";
import logo from "../../assets/logo.png"; // Import the logo image

const Header = () => {
  return (
    <AppBar
      position="sticky" // Makes the header sticky
      sx={{
        backgroundColor: "#f5f5f5",
        color: "#000",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds shadow
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensures it stays above other components like sidebars
      }}
    >
      <Toolbar disableGutters>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Stanford Medicine Logo" width={300} />
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
