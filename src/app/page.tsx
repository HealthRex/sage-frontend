import { Box, Container } from "@mui/material";
import Header from "@/components/header";
import MultiStepPageComponent from "@/components/multiStepPageComponent";



export default function Home() {

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f2f7ff50",
    }}
  >
    <Header />
    <Container
      maxWidth="lg"
      sx={{
         marginTop: "72px",
        marginBottom: 0,
        flex: 1,
        display: "flex",
        justifyContent: "center",
        padding: "0 0",
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
  </Box>
  );
}
