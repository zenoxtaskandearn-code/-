import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { RiBarChartBoxFill, RiLockPasswordFill, RiWallet3Fill } from "react-icons/ri";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/errors";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      const fallback = user?.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard";
      const nextPath = location.state?.from?.pathname || fallback;
      navigate(nextPath, { replace: true });
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 }, pt: { xs: "100px", md: "110px" } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" mb={1}>
            Welcome Back to Zenox
          </Typography>
          <Typography color="text.secondary" mb={2.5}>
            Login with your account and continue your premium earning journey.
          </Typography>
          <Stack spacing={1.1}>
            <Typography display="flex" alignItems="center" gap={1}><RiBarChartBoxFill /> Track tasks and completions live</Typography>
            <Typography display="flex" alignItems="center" gap={1}><RiWallet3Fill /> Manage wallet and withdrawals securely</Typography>
            <Typography display="flex" alignItems="center" gap={1}><RiLockPasswordFill /> Role-based access for user and admin</Typography>
          </Stack>
          <Box mt={2.5}>
            <Button component={RouterLink} to="/" variant="text">
              Back to Home
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 5 }}>
              <Typography variant="h5" mb={2}>
                Login
              </Typography>
              {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required fullWidth />
                  <TextField label="Password" name="password" type="password" value={form.password} onChange={onChange} required fullWidth />
                  <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ height: 48 }}>
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                </Stack>
              </Box>
              <Typography mt={2.2} color="text.secondary">
                New user? <Link component={RouterLink} to="/register">Create account</Link>
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
