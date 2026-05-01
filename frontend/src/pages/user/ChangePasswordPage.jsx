import { useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FiLock, FiUnlock } from "react-icons/fi";
import PageHeader from "../../components/common/PageHeader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const ChangePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await userApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Failed to change password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Change Password" subtitle="Update your account password to keep it secure." chip="Security" />
      </motion.div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card
          sx={{
            maxWidth: { xs: "100%", sm: 520 },
            borderRadius: 3,
            overflow: "hidden",
            background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
            border: "1px solid rgba(10,95,97,0.12)",
          }}
        >
          <Box p={{ xs: 2.5, sm: 3.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, rgba(10,95,97,0.2), rgba(76,180,196,0.1))",
                  border: "1px solid rgba(10,95,97,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiLock color="#4cb4c4" size={22} />
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize="1.1rem" color="#e2e8f0">Security Settings</Typography>
                <Typography fontSize={13} color="#64748b">Change your account password</Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={onChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUnlock color="#64748b" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.03)",
                    },
                  }}
                />

                <TextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={onChange}
                  required
                  fullWidth
                  helperText="Minimum 6 characters"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock color="#64748b" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.03)",
                    },
                  }}
                />

                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  required
                  fullWidth
                  error={form.confirmPassword !== "" && form.newPassword !== form.confirmPassword}
                  helperText={form.confirmPassword !== "" && form.newPassword !== form.confirmPassword ? "Passwords do not match" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock color="#64748b" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.03)",
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(135deg, #0a5f61, #4cb4c4)",
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 16px rgba(10,95,97,0.3)",
                    mt: 1,
                  }}
                >
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ChangePasswordPage;
