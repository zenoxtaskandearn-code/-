import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { RiUser3Fill } from "react-icons/ri";
import PageHeader from "../../components/common/PageHeader";
import { FormSkeleton } from "../../components/common/SkeletonLoader";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../lib/userApi";
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

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", profession: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        profession: user.profession || "",
      });
      setLoading(false);
    }
  }, [user]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const { data } = await userApi.updateProfile(form);
      const updated = data?.data?.user;
      if (updated) {
        setUser((prev) => ({ ...prev, ...updated }));
        localStorage.setItem("zenox_user", JSON.stringify({ ...user, ...updated }));
      }
      setMessage("Profile updated successfully");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Profile" subtitle="Loading profile..." chip="Profile" />
        <FormSkeleton />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Profile" subtitle="Manage your personal details and keep your account updated." chip="Profile" />
      </motion.div>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, maxWidth: 680 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ width: 56, height: 56, background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)" }}>
              <RiUser3Fill size={28} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Box>
          </Stack>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField label="Full Name" name="name" value={form.name} onChange={onChange} required fullWidth />
              <TextField label="Email" value={user?.email || ""} disabled fullWidth />
              <TextField label="Phone Number" name="phone" value={form.phone} onChange={onChange} required fullWidth />
              <Select label="Profession" name="profession" value={form.profession} onChange={onChange} displayEmpty required fullWidth
                renderValue={(selected) => (selected ? selected : "Select your profession")}
              >
                {PROFESSIONS.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </Select>
              <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: "flex-start", mt: 1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ProfilePage;
