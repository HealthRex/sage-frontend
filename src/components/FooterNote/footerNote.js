import React from "react";
import { Box, Typography } from "@mui/material";

const FooterNote = () => {
  return (
    <Box
      sx={{
        bgcolor: "#182635;", // Light background for distinction
        py: 4, // Vertical padding
        px: 2, // Horizontal padding for smaller screens
        textAlign: "center",
        borderTop: "1px solid #E0E0E0", // Subtle top border for separation
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "white", // Subtle text color
          fontSize: "0.9rem", // Slightly smaller font for a footer
          lineHeight: 1.6,
        }}
      >
        Stanford Econsult is a research product, is not medical care, and should be used with a healthcare professional
      </Typography>
      {/* <Typography
        variant="body2"
        sx={{
          color: "white", // Subtle text color
          fontSize: "0.9rem", // Slightly smaller font for a footer
          lineHeight: 1.6,
          "& a": { // Target <a> inside Typography
              color: "white",
            }
        }}
      >
        Website developed and maintained by <a href="https://www.linkedin.com/in/ethan-goh/" target="_blank" rel="noreferrer"  >Dr. Ethan Goh</a> (Product), <a href="https://www.linkedin.com/in/kanav-chopra-707a4212a/" target="_blank" rel="noreferrer">Kanav Chopra</a> (Development), <a href="https://www.linkedin.com/in/jonathan-h-chen/" target="_blank" rel="noreferrer">Dr. Jonathan H Chen</a> (PI) and <a href="https://www.healthrexlab.com/" target="_blank" rel="noreferrer">Stanford HealthRex Lab.</a>
      </Typography> */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "white", // Secondary text color
          fontSize: "0.8rem",
          fontStyle: "italic",
          "& a": { // Target <a> inside Typography
              color: "white",
            }
        }}
      >
        Copyright © 2025 - All rights reserved by <a href="https://www.healthrexlab.com/" target="_blank" rel="noreferrer">Stanford HealthRex Lab.</a>
      </Typography>
    </Box>
  );
};

export default FooterNote;
