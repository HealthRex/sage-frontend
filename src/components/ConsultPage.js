import React from "react";
import { Box, Typography, Paper, Link } from "@mui/material";

const EConsultPage = () => {
  const labData = [
    {
      label: "TSH",
      value: "8.2 mIU/L",
      status: "Abnormal",
      reference: "0.4-4.0",
      date: "2024-11-30",
    },
    {
      label: "Free T4",
      value: "0.9 ng/dL",
      status: "Normal",
      reference: "0.8-1.8",
      date: "2024-11-30",
    },
    {
      label: "TPO Antibodies",
      value: "180 IU/mL",
      status: "Abnormal",
      reference: "<35",
      date: "2024-11-30",
    },
  ];

  const historyData = [
    {
      title: "Past Medical History",
      detail: "No thyroid disease history",
      date: "2024-10-15",
    },
    {
      title: "Family History",
      detail: "Mother with hypothyroidism",
      date: "2024-10-15",
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left Side (Fixed Section) */}
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#f9f9f9",
          borderRight: "1px solid #ddd",
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Endocrinology E-Consult
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          E-Consult Turnaround: <b>24-48 hours</b>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          In-Person Wait: <b>2-3 months</b>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Resolution Rate: <b>73% without visit</b>
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Auto-populated Data
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {labData.map((lab, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                backgroundColor:
                  lab.status === "Abnormal" ? "#ffe6e6" : "#e6ffe6",
                borderLeft: `4px solid ${
                  lab.status === "Abnormal" ? "red" : "green"
                }`,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {lab.label}
              </Typography>
              <Typography variant="body2">Value: {lab.value}</Typography>
              <Typography variant="body2" color="textSecondary">
                Reference: {lab.reference}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {lab.date}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Right Side (Fixed Section) */}
      <Box
        sx={{
          width: "50%",
          p: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            AI-Generated Response
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            AI Confidence: <b>High</b>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Based on available data, this appears to be subclinical
            hypothyroidism with positive antibodies, suggesting Hashimoto's
            thyroiditis.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
            Likely Recommendations:
          </Typography>
          <ul>
            <li>Start levothyroxine 50mcg daily</li>
            <li>Reassess thyroid function in 6 weeks</li>
          </ul>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Relevant History
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          {historyData.map((history, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {history.title}
              </Typography>
              <Typography variant="body2">{history.detail}</Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {history.date}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Quick References
        </Typography>
        <Typography variant="body2">
          <Link href="#" underline="hover">
            ATA Guidelines: Subclinical Hypothyroidism
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default EConsultPage;
