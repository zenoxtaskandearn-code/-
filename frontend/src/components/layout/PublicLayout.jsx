import { Box } from "@mui/material";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";

const PublicLayout = ({ children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background:
        "linear-gradient(160deg, #0b1120 0%, #111827 40%, #0f172a 100%)",
    }}
  >
    <PublicHeader />
    <Box component="main" sx={{ flex: 1 }}>
      {children}
    </Box>
    <Footer />
  </Box>
);

export default PublicLayout;
