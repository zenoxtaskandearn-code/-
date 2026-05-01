import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaGift } from "react-icons/fa";
import { RiBarChartBoxFill, RiRocket2Fill, RiShieldCheckFill } from "react-icons/ri";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/errors";

const PROFESSIONS = [
  { value: "Student", label: "Student" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Marketer", label: "Marketer" },
  { value: "Content Creator", label: "Content Creator" },
  { value: "Business Owner", label: "Business Owner" },
  { value: "Other", label: "Other" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    password: "",
    referralCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm((prev) => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, [location.search]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(form);
      navigate(user?.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard", { replace: true });
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 }, pt: { xs: "100px", md: "110px" } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" mb={1}>
            Create Your Zenox Account
          </Typography>
          <Typography color="text.secondary" mb={2.5}>
            Setup your profile once and unlock task feeds, wallet rewards, and secure UPI withdrawal flow.
          </Typography>
          <Stack spacing={1}>
            <Typography display="flex" alignItems="center" gap={1}><RiRocket2Fill /> Fast onboarding in under 1 minute</Typography>
            <Typography display="flex" alignItems="center" gap={1}><RiBarChartBoxFill /> Dashboard with task and wallet analytics</Typography>
            <Typography display="flex" alignItems="center" gap={1}><RiShieldCheckFill /> Secure proof + verification process</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 5 }}>
              <Typography variant="h5" mb={2}>
                Register
              </Typography>
              {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField label="Full Name" name="name" value={form.name} onChange={onChange} required />
                  <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                  <TextField label="Phone Number" name="phone" value={form.phone} onChange={onChange} required />
                  <Select label="Profession" name="profession" value={form.profession} onChange={onChange} displayEmpty required
                    renderValue={(selected) => (selected ? selected : "Select your profession")}
                  >
                    {PROFESSIONS.map((p) => (
                      <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                    ))}
                  </Select>
                  <TextField label="Password" name="password" type="password" value={form.password} onChange={onChange} required />
                  <TextField
                    label="Referral Code (optional)"
                    name="referralCode"
                    value={form.referralCode}
                    onChange={onChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaGift style={{ color: "#ff9f1c" }} />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Have a referral code? Enter it to get bonuses"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.02)",
                      },
                    }}
                  />
                  <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ height: 48 }}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </Stack>
              </Box>
              <Typography mt={2.2} color="text.secondary">
                Already have account? <Link component={RouterLink} to="/login">Login now</Link>
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;
