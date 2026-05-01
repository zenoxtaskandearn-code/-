import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FiGift, FiLock, FiUnlock } from "react-icons/fi";
import PageHeader from "../../components/common/PageHeader";
import { CardSkeleton } from "../../components/common/SkeletonLoader";
import { adminApi } from "../../lib/adminApi";
import { api } from "../../lib/api";
import { getErrorMessage } from "../../lib/errors";

const AdminSettingsPage = () => {
  const [referralReward, setReferralReward] = useState("");
  const [referralLoading, setReferralLoading] = useState(true);
  const [referralError, setReferralError] = useState("");
  const [referralSuccess, setReferralSuccess] = useState("");
  const [referralSaving, setReferralSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const { data: response } = await adminApi.getReferralSetting();
        setReferralReward(String(response?.data?.referralRewardAmount || 0));
      } catch (apiError) {
        setReferralError(getErrorMessage(apiError));
      } finally {
        setReferralLoading(false);
      }
    };

    loadSetting();
  }, []);

  const handleReferralSave = async () => {
    setReferralError("");
    setReferralSuccess("");
    setReferralSaving(true);

    try {
      await adminApi.updateReferralSetting({ rewardAmount: Number(referralReward) });
      setReferralSuccess("Referral reward amount updated successfully");
    } catch (apiError) {
      setReferralError(getErrorMessage(apiError, "Failed to update"));
    } finally {
      setReferralSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (apiError) {
      setPasswordError(getErrorMessage(apiError, "Failed to change password"));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Settings" subtitle="Configure referral rewards and manage your account security." chip="Settings" />
      </motion.div>

      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
                border: "1px solid rgba(10,95,97,0.12)",
              }}
            >
              <Box p={{ xs: 2, sm: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(255,159,28,0.15), rgba(255,159,28,0.05))",
                      border: "1px solid rgba(255,159,28,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiGift color="#ff9f1c" size={20} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize="1rem" color="#e2e8f0">Referral Reward</Typography>
                    <Typography fontSize={12} color="#64748b">Amount earned per successful referral</Typography>
                  </Box>
                </Stack>

                {referralLoading ? (
                  <CardSkeleton />
                ) : (
                  <>
                    {referralError && <Alert severity="error" sx={{ mb: 2 }}>{referralError}</Alert>}
                    {referralSuccess && <Alert severity="success" sx={{ mb: 2 }}>{referralSuccess}</Alert>}

                    <TextField
                      label="Reward Amount (₹)"
                      type="number"
                      value={referralReward}
                      onChange={(e) => setReferralReward(e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography color="#94a3b8" fontWeight={700}>₹</Typography>
                          </InputAdornment>
                        ),
                      }}
                      helperText="Users earn this amount when someone joins using their code"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.03)",
                        },
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={handleReferralSave}
                      disabled={referralSaving}
                      sx={{
                        background: "linear-gradient(135deg, #995c00, #cc7a00)",
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "0 4px 16px rgba(153,92,0,0.3)",
                        width: "100%",
                      }}
                    >
                      {referralSaving ? "Saving..." : "Update Reward Amount"}
                    </Button>
                  </>
                )}
              </Box>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
                border: "1px solid rgba(10,95,97,0.12)",
              }}
            >
              <Box p={{ xs: 2, sm: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(10,95,97,0.2), rgba(76,180,196,0.1))",
                      border: "1px solid rgba(10,95,97,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiLock color="#4cb4c4" size={20} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize="1rem" color="#e2e8f0">Change Password</Typography>
                    <Typography fontSize={12} color="#64748b">Update your admin account password</Typography>
                  </Box>
                </Stack>

                {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
                {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}

                <Box component="form" onSubmit={handlePasswordChange}>
                  <Stack spacing={2}>
                    <TextField
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.03)",
                        },
                      }}
                    />

                    <TextField
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      required
                      fullWidth
                      helperText="Minimum 6 characters"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.03)",
                        },
                      }}
                    />

                    <TextField
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      fullWidth
                      error={passwordForm.confirmPassword !== "" && passwordForm.newPassword !== passwordForm.confirmPassword}
                      helperText={passwordForm.confirmPassword !== "" && passwordForm.newPassword !== passwordForm.confirmPassword ? "Passwords do not match" : ""}
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
                      disabled={passwordLoading}
                      sx={{
                        background: "linear-gradient(135deg, #0a5f61, #4cb4c4)",
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "0 4px 16px rgba(10,95,97,0.3)",
                        width: "100%",
                      }}
                    >
                      {passwordLoading ? "Updating..." : "Change Password"}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminSettingsPage;
