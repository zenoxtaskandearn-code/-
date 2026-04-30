import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <Container maxWidth="md" sx={{ py: 10, pt: "110px", textAlign: "center" }}>
    <Typography variant="h2" mb={1}>404</Typography>
    <Typography variant="h5" mb={1}>Page not found</Typography>
    <Typography color="text.secondary" mb={3}>The page you are looking for does not exist.</Typography>
    <Box>
      <Button variant="contained" component={Link} to="/">Go Home</Button>
    </Box>
  </Container>
);

export default NotFoundPage;
