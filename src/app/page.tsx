import { Box, Container } from "@mui/material";
import Header from "@/components/header";
import MultiStepPageComponent from "@/components/multiStepPageComponent";
import Footer from "@/components/footer";



export default function Home() {

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
        marginTop: 12,
        marginBottom: 4,
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
    <Footer />
  </Box>
  );
}
