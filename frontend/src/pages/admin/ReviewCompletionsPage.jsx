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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { TableSkeleton, CardSkeleton } from "../../components/common/SkeletonLoader";
import { adminApi } from "../../lib/adminApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);
const MotionTableRow = motion.create(TableRow);

const reviewStatusConfig = {
  PENDING: { label: "Pending Review", bg: "rgba(153,92,0,0.15)", color: "#ff9f1c" },
  APPROVED: { label: "Approved", bg: "rgba(0,168,84,0.15)", color: "#00a854" },
  REJECTED: { label: "Rejected", bg: "rgba(211,47,47,0.15)", color: "#d32f2f" },
};

const ReviewCompletionsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  const loadRows = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getCompletions();
      setRows(data?.data?.completions || []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const handleReview = async (reviewStatus) => {
    setError("");
    try {
      await adminApi.reviewCompletion(selected.id, { reviewStatus, adminNote: note });
      setMessage(`Task completion ${reviewStatus.toLowerCase()}`);
      setDialogOpen(false);
      setSelected(null);
      setNote("");
      await loadRows();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  const renderMobileCard = (row, index) => (
    <MotionCard
      key={row.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05 }}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
        border: "1px solid rgba(10,95,97,0.12)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "rgba(10,95,97,0.25)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Box p={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box>
            <Typography fontWeight={700} fontSize={14} color="#e2e8f0">{row.name}</Typography>
            <Typography color="#64748b" fontSize={12}>{row.email}</Typography>
          </Box>
          <Chip
            label={reviewStatusConfig[row.review_status]?.label || "Pending Review"}
            size="small"
            sx={{
              background: reviewStatusConfig[row.review_status]?.bg || reviewStatusConfig.PENDING.bg,
              color: reviewStatusConfig[row.review_status]?.color || reviewStatusConfig.PENDING.color,
              fontWeight: 600,
              border: "none",
              fontSize: "0.7rem",
            }}
          />
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 1.2 }} />

        <Grid container spacing={1.5} mb={1.5}>
          <Grid item xs={6}>
            <Typography fontSize={11} color="#64748b" fontWeight={500}>Task</Typography>
            <Typography fontWeight={600} fontSize={13} color="#e2e8f0" noWrap>{row.title}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={11} color="#64748b" fontWeight={500}>Reward</Typography>
            <Typography fontWeight={700} fontSize={14} sx={{ color: "#00a854" }}>+₹{Number(row.reward_amount).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={11} color="#64748b" fontWeight={500}>Category</Typography>
            <Chip label={row.category} size="small" sx={{ background: "rgba(10,95,97,0.15)", color: "#4cb4c4", fontSize: "0.7rem", height: 20, mt: 0.3 }} />
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={11} color="#64748b" fontWeight={500}>Submitted</Typography>
            <Typography fontSize={13} color="#94a3b8">{new Date(row.completed_at).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

        {row.screenshot_url && (
          <Box
            component="a"
            href={row.screenshot_url}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: "block",
              mb: 1.5,
              p: 1.2,
              borderRadius: 2,
              background: "rgba(76,180,196,0.06)",
              border: "1px solid rgba(76,180,196,0.1)",
              color: "#4cb4c4",
              fontSize: 13,
              fontWeight: 500,
              textAlign: "center",
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": { background: "rgba(76,180,196,0.12)" },
            }}
          >
            View Proof Screenshot
          </Box>
        )}

        {row.review_status === "PENDING" ? (
          <Button
            fullWidth
            size="small"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #0a5f61, #4cb4c4)",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              boxShadow: "0 4px 16px rgba(10,95,97,0.3)",
            }}
            onClick={() => { setSelected(row); setNote(""); setDialogOpen(true); }}
          >
            Review Submission
          </Button>
        ) : (
          row.admin_note && (
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Typography fontSize={11} color="#64748b" fontWeight={500}>Admin Note</Typography>
              <Typography fontSize={12} color="#94a3b8">{row.admin_note}</Typography>
            </Box>
          )
        )}
      </Box>
    </MotionCard>
  );

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Task Completions" subtitle="Review user-submitted proof screenshots before crediting rewards." chip="Review Queue" />
      </motion.div>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {loading ? (
          <Grid container spacing={1.5}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} key={i}><CardSkeleton /></Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={1.5}>
            {rows.map((row, index) => renderMobileCard(row, index))}
            {rows.length === 0 && (
              <Card sx={{ p: 4, borderRadius: 3, textAlign: "center", background: "linear-gradient(160deg, #0b1120, #0d1525)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography color="#64748b">No pending submissions</Typography>
              </Card>
            )}
          </Stack>
        )}
      </Box>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} sx={{ display: { xs: "none", md: "block" } }}>
        <Card sx={{ borderRadius: 3, overflow: "hidden", background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)", border: "1px solid rgba(10,95,97,0.1)" }}>
          {loading ? (
            <TableSkeleton rows={8} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Reward</TableCell>
                    <TableCell>Proof</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    const statusCfg = reviewStatusConfig[row.review_status] || reviewStatusConfig.PENDING;
                    return (
                      <MotionTableRow key={row.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.05 }}>
                        <TableCell>
                          <Typography fontWeight={600} sx={{ fontSize: "0.9rem" }}>{row.name}</Typography>
                          <Typography color="text.secondary" fontSize={12}>{row.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600} fontSize={13}>{row.title}</Typography>
                          <Chip label={row.category} size="small" sx={{ background: "rgba(10,95,97,0.15)", color: "#4cb4c4", fontSize: "0.7rem", height: 20, mt: 0.5 }} />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={700} sx={{ color: "#00a854" }}>+₹{Number(row.reward_amount).toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell>{row.screenshot_url ? <a href={row.screenshot_url} target="_blank" rel="noreferrer" style={{ color: "#4cb4c4" }}>View Proof</a> : "—"}</TableCell>
                        <TableCell>
                          <Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }} />
                        </TableCell>
                        <TableCell sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>{new Date(row.completed_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {row.review_status === "PENDING" ? (
                            <Button size="small" variant="contained" sx={{ background: "linear-gradient(135deg, #0a5f61, #4cb4c4)" }} onClick={() => { setSelected(row); setNote(""); setDialogOpen(true); }}>Review</Button>
                          ) : (
                            <Typography fontSize={12} color="text.secondary">{row.admin_note || "—"}</Typography>
                          )}
                        </TableCell>
                      </MotionTableRow>
                    );
                  })}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                        No pending submissions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setSelected(null); setNote(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Review Task Completion</DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Typography fontSize={12} color="text.secondary">User</Typography>
                  <Typography fontWeight={600} fontSize={14}>{selected.name}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Typography fontSize={12} color="text.secondary">Task</Typography>
                  <Typography fontWeight={600} fontSize={14}>{selected.title}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Typography fontSize={12} color="text.secondary">Reward</Typography>
                  <Typography fontWeight={700} fontSize={14} sx={{ color: "#00a854" }}>+₹{Number(selected.reward_amount).toFixed(2)}</Typography>
                </Box>
              </Stack>
              {selected.screenshot_url && (
                <Box component="img" src={selected.screenshot_url} alt="Proof" sx={{ width: "100%", maxHeight: 400, borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)", mb: 2, objectFit: "contain" }} />
              )}
              <TextField label="Admin Note (optional)" fullWidth multiline minRows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setSelected(null); setNote(""); }}>Cancel</Button>
          <Button variant="outlined" sx={{ borderColor: "#d32f2f", color: "#d32f2f" }} onClick={() => handleReview("REJECTED")}>Reject</Button>
          <Button variant="contained" sx={{ background: "linear-gradient(135deg, #00a854, #008c44)" }} onClick={() => handleReview("APPROVED")}>Approve & Credit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewCompletionsPage;
