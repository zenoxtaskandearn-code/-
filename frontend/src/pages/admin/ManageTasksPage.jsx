import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { CardSkeleton } from "../../components/common/SkeletonLoader";
import { adminApi } from "../../lib/adminApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);

const emptyForm = {
  title: "",
  category: "",
  description: "",
  rewardAmount: "",
  imageUrl: "",
  taskUrl: "",
  isActive: true,
  maxUsers: "",
};

const CATEGORIES = [
  { value: "YouTube", label: "YouTube" },
  { value: "Instagram", label: "Instagram" },
  { value: "Twitter/X", label: "Twitter/X" },
  { value: "Telegram", label: "Telegram" },
  { value: "Discord", label: "Discord" },
  { value: "Website Visit", label: "Website Visit" },
  { value: "App Install", label: "App Install" },
  { value: "Survey", label: "Survey" },
  { value: "Referral", label: "Referral" },
  { value: "Other", label: "Other" },
];

const ManageTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getTasks();
      setTasks(data?.data?.tasks || []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      category: task.category,
      description: task.description,
      rewardAmount: task.reward_amount,
      imageUrl: task.image_url,
      taskUrl: task.task_url,
      isActive: Boolean(task.is_active),
      maxUsers: task.max_users || "",
    });
    setOpen(true);
  };

  const onSubmit = async () => {
    setError("");
    setMessage("");
    setSubmitting(true);

    const payload = { ...form, rewardAmount: Number(form.rewardAmount), maxUsers: form.maxUsers ? Number(form.maxUsers) : 0 };

    try {
      if (editingTask) {
        await adminApi.updateTask(editingTask.id, payload);
        setMessage("Task updated.");
      } else {
        await adminApi.createTask(payload);
        setMessage("Task created.");
      }
      setOpen(false);
      await loadTasks();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await adminApi.deleteTask(id);
      setMessage("Task deleted.");
      await loadTasks();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  const renderMobileCard = (task, index) => {
    const completedCount = task.completed_count || 0;
    const maxUsers = task.max_users || 0;
    const isLimited = maxUsers > 0;
    const slotsRemaining = isLimited ? Math.max(0, maxUsers - completedCount) : "∞";

    return (
    <MotionCard
      key={task.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07 }}
      sx={{
        p: 2.2,
        borderRadius: 3,
        background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
        border: "1px solid rgba(10,95,97,0.12)",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "rgba(10,95,97,0.25)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.2}>
        <Chip label={task.category} size="small" sx={{ background: "rgba(10,95,97,0.15)", color: "#4cb4c4", border: "1px solid rgba(10,95,97,0.2)", fontWeight: 600 }} />
        <Stack direction="row" spacing={0.6}>
          {isLimited && (
            <Chip
              label={`${completedCount}/${maxUsers}`}
              size="small"
              sx={{
                background: slotsRemaining === 0 ? "rgba(211,47,47,0.15)" : "rgba(153,92,0,0.15)",
                color: slotsRemaining === 0 ? "#d32f2f" : "#ff9f1c",
                fontWeight: 600,
                border: "none",
              }}
            />
          )}
          <Chip label={task.is_active ? "Active" : "Inactive"} size="small" sx={{ background: task.is_active ? "rgba(0,168,84,0.15)" : "rgba(211,47,47,0.15)", color: task.is_active ? "#00a854" : "#d32f2f", fontWeight: 600, border: "none" }} />
        </Stack>
      </Stack>
      <Typography variant="h6" mb={0.6} sx={{ fontWeight: 600, fontSize: "1rem", color: "#e2e8f0" }}>{task.title}</Typography>
      <Typography color="text.secondary" mb={1} sx={{ fontSize: "0.85rem", lineHeight: 1.5 }}>{task.description?.slice(0, 100)}{task.description?.length > 100 ? "..." : ""}</Typography>
      <Typography mb={0.5} sx={{ color: "#00a854", fontWeight: 700, fontSize: "1.1rem" }}>+₹{Number(task.reward_amount).toFixed(2)}</Typography>
      {isLimited && (
        <Typography mb={1.5} fontSize={12} color={slotsRemaining === 0 ? "#d32f2f" : "#94a3b8"} fontWeight={500}>
          {slotsRemaining === 0 ? "All slots filled" : `${slotsRemaining} slots remaining`}
        </Typography>
      )}
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={() => openEdit(task)}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={() => deleteTask(task.id)}
          sx={{ borderRadius: 2, textTransform: "none", borderColor: "#d32f2f", color: "#d32f2f" }}
        >
          Delete
        </Button>
      </Stack>
    </MotionCard>
    );
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Manage Tasks" subtitle="Create, edit, activate, and remove task campaigns quickly." chip="Task Admin" />
      </motion.div>

      {error ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </motion.div>
      ) : null}
      {message ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
        </motion.div>
      ) : null}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Button variant="contained" onClick={openCreate} sx={{ mb: 2.3, background: "linear-gradient(135deg, #0a5f61, #4cb4c4)", borderRadius: 2.5, textTransform: "none", fontWeight: 600, boxShadow: "0 4px 16px rgba(10,95,97,0.3)" }}>
          Create Task
        </Button>
      </motion.div>

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} md={6} lg={4} key={i}><CardSkeleton /></Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task, index) => (
            <Grid item xs={12} sm={6} lg={4} key={task.id}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.07 }}
              >
                {renderMobileCard(task, index)}
              </motion.div>
            </Grid>
          ))}
          {tasks.length === 0 && (
            <Grid item xs={12}>
              <Card sx={{ p: 4, borderRadius: 3, textAlign: "center", background: "linear-gradient(160deg, #0b1120, #0d1525)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography color="#64748b">No tasks created yet</Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.4} sx={{ mt: 1 }}>
            <TextField label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            <Select label="Category" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} displayEmpty
              renderValue={(selected) => (selected ? selected : "Select a category")}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </Select>
            <TextField multiline minRows={3} label="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
            <TextField type="number" label="Reward Amount" value={form.rewardAmount} onChange={(event) => setForm((prev) => ({ ...prev, rewardAmount: event.target.value }))} />
            <TextField
              type="number"
              label="Max Users (0 = unlimited)"
              value={form.maxUsers}
              onChange={(event) => setForm((prev) => ({ ...prev, maxUsers: event.target.value }))}
              helperText="Leave 0 for unlimited user completions"
            />
            <TextField label="Image URL" value={form.imageUrl} onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))} />
            <TextField label="Task URL" value={form.taskUrl} onChange={(event) => setForm((prev) => ({ ...prev, taskUrl: event.target.value }))} />
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))} />}
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ background: "linear-gradient(135deg, #0a5f61, #4cb4c4)" }} onClick={onSubmit} disabled={submitting}>
            {submitting ? (editingTask ? "Saving..." : "Creating...") : editingTask ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTasksPage;
