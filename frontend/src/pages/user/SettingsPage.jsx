import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { RiMailFill, RiNotification3Fill, RiEyeFill } from "react-icons/ri";
import PageHeader from "../../components/common/PageHeader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const settingsItems = [
  { key: "notifyEmail", label: "Email notifications", icon: <RiMailFill />, desc: "Receive updates and alerts via email" },
  { key: "notifyPush", label: "Push notifications", icon: <RiNotification3Fill />, desc: "Get real-time push notifications" },
  { key: "profilePublic", label: "Public profile visibility", icon: <RiEyeFill />, desc: "Allow others to view your profile" },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifyEmail: true,
    notifyPush: true,
    profilePublic: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await userApi.getSettings();
        const res = data?.data?.settings;
        setSettings({
          notifyEmail: Boolean(res?.notify_email),
          notifyPush: Boolean(res?.notify_push),
          profilePublic: Boolean(res?.profile_public),
        });
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await userApi.updateSettings(settings);
      setMessage("Settings updated successfully.");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Privacy & Settings" subtitle="Loading..." chip="Settings" />
        <Card sx={{ p: 2.5, borderRadius: 3, maxWidth: 740 }}>
          <Skeleton width={160} height={20} sx={{ mb: 2, background: "rgba(255,255,255,0.04)" }} />
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Skeleton variant="circular" width={44} height={24} sx={{ mr: 1.5, background: "rgba(255,255,255,0.04)" }} />
              <Skeleton width={140} height={14} sx={{ background: "rgba(255,255,255,0.04)" }} />
            </Box>
          ))}
          <Skeleton width={120} height={36} sx={{ mt: 1, borderRadius: 2, background: "rgba(255,255,255,0.04)" }} />
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Privacy & Settings" subtitle="Control your notification and profile visibility preferences." chip="Settings" />
      </motion.div>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, maxWidth: 740 }}>
          <Typography variant="h6" mb={0.5} sx={{ fontWeight: 600 }}>Notification Controls</Typography>
          <Typography variant="body2" color="text.secondary" mb={2.5}>Manage how you receive updates and who can see your profile.</Typography>
          <Stack spacing={1.5}>
            {settingsItems.map((item) => (
              <Box key={item.key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ color: "#4cb4c4", display: "flex" }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                  </Box>
                </Stack>
                <Switch checked={settings[item.key]} onChange={(event) => setSettings((prev) => ({ ...prev, [item.key]: event.target.checked }))} />
              </Box>
            ))}
            <Button variant="contained" sx={{ alignSelf: "flex-start", mt: 1 }} onClick={saveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </Stack>
        </Card>
      </motion.div>
    </Box>
  );
};

export default SettingsPage;
