"use client"; // Ensure this runs on the client side

import { AppBar, Toolbar, Container } from "@mui/material";
import Image from "next/image";
import logo from "../../public/images/logo.png";

export default function Header() {
  return (
    <AppBar
      position="fixed" // Change from "sticky" to "fixed" for a guaranteed effect
      sx={{
        top: 0,
        left: 0,
        width: "100%", // Ensure it spans the full width
        backgroundColor: "#f5f5f5",
        color: "#000",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1100, // Ensure it stays on top
      }}
    >
      <Toolbar disableGutters>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
          <Image src={logo} alt="Stanford Medicine Logo" width={300} height={80} />
        </Container>
      </Toolbar>
    </AppBar>
  );
}
