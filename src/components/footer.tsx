"use client";

import React from "react";


export default function Footer() {
    return (
      <footer
        style={{
          backgroundColor: "#182635",
          padding: "20px",
          textAlign: "center",
          borderTop: "1px solid #E0E0E0",
          color: "white",
        }}
      >
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
          Stanford Econsult is a research product, is not medical care, and should be used with a healthcare professional
        </p>
        {/* Uncomment this section if needed */}
        {/* <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
        Website developed and maintained by <a href="https://www.linkedin.com/in/ethan-goh/" target="_blank" rel="noreferrer" style={{ color: "white" }}>Dr. Ethan Goh</a> (Product), <a href="https://www.linkedin.com/in/kanav-chopra-707a4212a/" target="_blank" rel="noreferrer" style={{ color: "white" }}>Kanav Chopra</a> (Development), <a href="https://www.linkedin.com/in/jonathan-h-chen/" target="_blank" rel="noreferrer" style={{ color: "white" }}>Dr. Jonathan H Chen</a> (PI) and <a href="https://www.healthrexlab.com/" target="_blank" rel="noreferrer" style={{ color: "white" }}>Stanford HealthRex Lab.</a>
        </p> */}
        <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
          Copyright © 2025 - All rights reserved by <a href="https://www.healthrexlab.com/" target="_blank" rel="noreferrer" style={{ color: "white" }}>Stanford HealthRex Lab.</a>
        </p>
      </footer>
    );
  };
  
