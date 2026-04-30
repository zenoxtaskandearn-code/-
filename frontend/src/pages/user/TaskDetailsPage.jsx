import { useEffect, useState } from "react";
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
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);

const reviewStatusConfig = {
  APPROVED: { label: "Approved", bg: "rgba(0,230,118,0.12)", color: "#00e676" },
  PENDING: { label: "Under Review", bg: "rgba(255,159,28,0.12)", color: "#ff9f1c" },
  REJECTED: { label: "Rejected", bg: "rgba(255,82,82,0.12)", color: "#ff5252" },
  NOT_STARTED: { label: "New", bg: "rgba(148,163,184,0.08)", color: "#94a3b8" },
};

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [starting, setStarting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const loadTask = async () => {
    try {
      const { data } = await userApi.getTaskById(taskId);
      setTask(data?.data?.task || null);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const handleStart = async () => {
    setMessage("");
    setError("");
    setStarting(true);
    try {
      const { data } = await userApi.startTask(taskId);
      const url = data?.data?.redirectUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      setMessage("Task started. Complete it in the other tab, then come back and upload your proof.");
      setLoading(true);
      await loadTask();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setStarting(false);
    }
  };

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitCompletion = async () => {
    if (!screenshot) {
      setError("Screenshot is required");
      return;
    }
    setMessage("");
    setError("");
    setCompleting(true);
    setOpenComplete(false);
    try {
      const formData = new FormData();
      formData.append("screenshot", screenshot);
      await userApi.completeTask(taskId, formData);
      setMessage("Screenshot submitted! Admin will review and credit your reward.");
      setLoading(true);
      await loadTask();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setCompleting(false);
      setScreenshot(null);
      setPreviewUrl(null);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Task Details" subtitle="Loading task..." chip="Task Insight" />
        <MotionCard sx={{ p: 2.5, borderRadius: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5}>
              <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 2, background: "rgba(255,255,255,0.04)" }} />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <Skeleton width={80} height={24} sx={{ borderRadius: 1, background: "rgba(255,255,255,0.04)" }} />
                <Skeleton width={100} height={24} sx={{ borderRadius: 1, background: "rgba(255,255,255,0.04)" }} />
              </Box>
              <Skeleton width="70%" height={28} sx={{ mb: 1, background: "rgba(255,255,255,0.04)" }} />
              <Skeleton width="100%" height={14} sx={{ mb: 0.5, background: "rgba(255,255,255,0.04)" }} />
              <Skeleton width="90%" height={14} sx={{ mb: 0.5, background: "rgba(255,255,255,0.04)" }} />
              <Skeleton width="60%" height={14} sx={{ mb: 2, background: "rgba(255,255,255,0.04)" }} />
              <Skeleton width={160} height={22} sx={{ mb: 2, background: "rgba(255,255,255,0.04)" }} />
              <Stack direction="row" spacing={1.5}>
                <Skeleton width={120} height={38} sx={{ borderRadius: 2, background: "rgba(255,255,255,0.04)" }} />
                <Skeleton width={120} height={38} sx={{ borderRadius: 2, background: "rgba(255,255,255,0.04)" }} />
              </Stack>
            </Grid>
          </Grid>
        </MotionCard>
      </Box>
    );
  }

  if (!task) {
    return <Alert severity="warning">Task not found.</Alert>;
  }

  const reviewCfg = reviewStatusConfig[task.review_status] || reviewStatusConfig.NOT_STARTED;
  const maxUsers = task.max_users || 0;
  const completedCount = task.completed_count || 0;
  const isLimited = maxUsers > 0;
  const slotsRemaining = isLimited ? Math.max(0, maxUsers - completedCount) : null;
  const isTaskFull = isLimited && slotsRemaining === 0;
  const slotPct = isLimited ? Math.min(100, (completedCount / maxUsers) * 100) : 0;

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Task Details" subtitle="Review instructions and start the task through the campaign URL." chip="Task Insight" />
      </motion.div>
      {error ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </motion.div>
      ) : null}
      {message ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
        </motion.div>
      ) : null}

      {task.my_status === "NOT_STARTED" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You need to <strong>Start Task</strong> first. This will open the task URL in a new tab. After completing the task, come back and upload your proof.
        </Alert>
      )}
      {task.my_status === "STARTED" && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Task started. Complete the task in the other tab, then upload your <strong>screenshot proof</strong> for admin review.
        </Alert>
      )}
      {task.my_status === "COMPLETED" && task.review_status === "PENDING" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your proof has been submitted and is <strong>under review</strong>. Once approved by admin, the reward will be credited to your wallet.
        </Alert>
      )}
      {task.my_status === "COMPLETED" && task.review_status === "APPROVED" && (
        <Alert severity="success" sx={{ mb: 2 }}>
          This task was approved and your reward of <strong style={{ color: "#00e676" }}>+₹{Number(task.reward_amount).toFixed(2)}</strong> has been credited.
        </Alert>
      )}
      {task.my_status === "COMPLETED" && task.review_status === "REJECTED" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Your submission was rejected. <strong>Reason:</strong> {task.admin_note || "Invalid proof."}
        </Alert>
      )}

      {isTaskFull && task.my_status === "NOT_STARTED" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography fontWeight={600} fontSize={14}>This task is full</Typography>
          <Typography fontSize={13}>All {maxUsers} slots have been completed. No more users can start this task.</Typography>
        </Alert>
      )}

      {isLimited && task.my_status !== "COMPLETED" && !isTaskFull && (
        <Card sx={{ p: 2, borderRadius: 3, mb: 2, background: "linear-gradient(160deg, #0b1120, #0d1525)", border: "1px solid rgba(10,95,97,0.12)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight={600} fontSize={13} color={slotsRemaining <= 3 ? "#ff9f1c" : "#00a854"}>
              {slotsRemaining <= 3 ? "Hurry! " : ""}{slotsRemaining} slot{slotsRemaining === 1 ? "" : "s"} remaining out of {maxUsers}
            </Typography>
            <Typography fontSize={12} color="#64748b" fontWeight={600}>{Math.round(slotPct)}%</Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <Box
              sx={{
                width: `${slotPct}%`,
                height: "100%",
                borderRadius: 3,
                background: slotPct > 80
                  ? "linear-gradient(90deg, #d32f2f, #b71c1c)"
                  : slotPct > 50
                  ? "linear-gradient(90deg, #ff9f1c, #cc7a00)"
                  : "linear-gradient(90deg, #00a854, #008c44)",
                transition: "width 0.5s ease",
              }}
            />
          </Box>
        </Card>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <MotionCard sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 3 }} whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(15,139,141,0.1)" }}>
          <Grid container spacing={{ xs: 2, sm: 2.5 }}>
            <Grid item xs={12} md={5}>
              <Box component="img" src={task.image_url} alt={task.title} sx={{ width: "100%", height: { xs: 200, sm: 260, md: 320 }, objectFit: "cover", borderRadius: 3 }} />
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1} mb={1.1} flexWrap="wrap">
                <Chip label={task.category} size="small" sx={{ background: "rgba(15,139,141,0.12)", color: "#4cb4c4", border: "1px solid rgba(15,139,141,0.2)", fontWeight: 600 }} />
                <Chip label={reviewCfg.label} size="small" sx={{ background: reviewCfg.bg, color: reviewCfg.color, border: "none", fontWeight: 600 }} />
              </Stack>
              <Typography variant="h4" mb={1} sx={{ fontWeight: 600, fontSize: { xs: "1.4rem", sm: "1.6rem" } }}>{task.title}</Typography>
              <Typography color="text.secondary" mb={2} sx={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{task.description}</Typography>
              <Typography variant="h6" sx={{ color: "#00e676", fontWeight: 700, mb: 2 }}>+₹{Number(task.reward_amount).toFixed(2)}</Typography>
              {isLimited && (
                <Typography color={isTaskFull ? "#d32f2f" : "#94a3b8"} mb={2} sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  {isTaskFull
                    ? `All ${maxUsers} slots filled — task closed`
                    : `${completedCount} / ${maxUsers} completed (${slotsRemaining} remaining)`}
                </Typography>
              )}
              {!isLimited && (
                <Typography color="text.secondary" mb={2} sx={{ fontSize: "0.85rem" }}>Completed by {completedCount} users</Typography>
              )}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <Button
                  variant="contained"
                  onClick={handleStart}
                  disabled={starting || task.my_status === "STARTED" || task.my_status === "COMPLETED" || isTaskFull}
                  sx={{ minWidth: { xs: "100%", sm: "auto" } }}
                >
                  {isTaskFull ? "Task Full" : starting ? "Starting..." : task.my_status === "STARTED" ? "Already Started" : "Start Task"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenComplete(true)}
                  disabled={task.my_status !== "STARTED" || completing || isTaskFull}
                  sx={{ minWidth: { xs: "100%", sm: "auto" } }}
                >
                  {completing ? "Submitting..." : isTaskFull ? "No Slots Left" : "Upload Proof & Complete"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </MotionCard>
      </motion.div>

      {/* Screenshot Upload Dialog */}
      <Dialog open={openComplete} onClose={() => { setOpenComplete(false); setScreenshot(null); setPreviewUrl(null); }} fullWidth maxWidth="sm">
        <DialogTitle>Submit Proof of Completion</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography fontSize={12} fontWeight={600}>Your screenshot will be used as proof. If it&apos;s invalid or fake, your request will be rejected and your account may be blocked by our team.</Typography>
            </Alert>
            <Button variant="outlined" component="label" fullWidth sx={{ py: 2, mb: 2, borderRadius: 2 }}>
              {screenshot ? screenshot.name : "Choose Screenshot"}
              <input hidden type="file" accept="image/*" onChange={handleScreenshotChange} />
            </Button>
            {previewUrl && (
              <Box component="img" src={previewUrl} alt="Preview" sx={{ width: "100%", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenComplete(false); setScreenshot(null); setPreviewUrl(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitCompletion} disabled={!screenshot}>Submit Proof</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetailsPage;
