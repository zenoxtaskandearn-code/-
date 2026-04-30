import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
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

const statuses = ["PENDING", "APPROVED", "REJECTED", "PAID"];

const withdrawalStatusConfig = {
  PENDING: { label: "Pending", bg: "rgba(153,92,0,0.15)", color: "#ff9f1c" },
  APPROVED: { label: "Approved", bg: "rgba(0,168,84,0.15)", color: "#00a854" },
  REJECTED: { label: "Rejected", bg: "rgba(211,47,47,0.15)", color: "#d32f2f" },
  PAID: { label: "Paid", bg: "rgba(76,180,196,0.15)", color: "#4cb4c4" },
};

const WithdrawalsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRows = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getWithdrawals();
      setRows(data?.data?.withdrawals || []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const updateStatus = async (id, status) => {
    setError("");
    try {
      await adminApi.updateWithdrawal(id, { status, adminNote: `Set as ${status}` });
      setMessage(`Withdrawal updated to ${status}`);
      await loadRows();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  const renderMobileCard = (row, index) => {
    const statusCfg = withdrawalStatusConfig[row.status] || withdrawalStatusConfig.PENDING;
    const isRejected = row.status === "REJECTED";

    return (
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
              label={statusCfg.label}
              size="small"
              sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }}
            />
          </Stack>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 1.2 }} />

          <Grid container spacing={1.5} mb={1.5}>
            <Grid item xs={6}>
              <Typography fontSize={11} color="#64748b" fontWeight={500}>Amount</Typography>
              <Typography fontWeight={700} fontSize={15} sx={{ color: isRejected ? "#d32f2f" : "#00a854" }}>
                {isRejected ? "−" : "+"}₹{Number(row.amount).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontSize={11} color="#64748b" fontWeight={500}>UPI ID</Typography>
              <Typography fontSize={13} color="#94a3b8" fontFamily="monospace">{row.upi_id}</Typography>
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
              View Payment Proof
            </Box>
          )}

          <Stack spacing={1}>
            <TextField
              select
              size="small"
              defaultValue={row.status}
              onChange={(event) => updateStatus(row.id, event.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.03)",
                },
              }}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2, textTransform: "none" }}
                onClick={() => updateStatus(row.id, "APPROVED")}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="contained"
                fullWidth
                sx={{
                  background: "rgba(76,180,196,0.15)",
                  color: "#4cb4c4",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": { background: "rgba(76,180,196,0.25)" },
                }}
                onClick={() => updateStatus(row.id, "PAID")}
              >
                Paid
              </Button>
            </Stack>
          </Stack>
        </Box>
      </MotionCard>
    );
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Withdrawals" subtitle="Review payout proofs and update payout workflow status." chip="Payout Queue" />
      </motion.div>
      {error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </motion.div>
      ) : null}
      {message ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
          <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
        </motion.div>
      ) : null}

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
                <Typography color="#64748b">No withdrawal requests found.</Typography>
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
                    <TableCell>Amount</TableCell>
                    <TableCell>UPI ID</TableCell>
                    <TableCell>Proof</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    const statusCfg = withdrawalStatusConfig[row.status] || withdrawalStatusConfig.PENDING;
                    const isRejected = row.status === "REJECTED";
                    return (
                      <MotionTableRow
                        key={row.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.05 }}
                      >
                        <TableCell>
                          <Typography fontWeight={600} sx={{ fontSize: "0.9rem" }}>{row.name}</Typography>
                          <Typography color="text.secondary" fontSize={12}>{row.email}</Typography>
                        </TableCell>
                        <TableCell sx={{ color: isRejected ? "#d32f2f" : "#00a854", fontWeight: 700 }}>
                          {isRejected ? "−" : "+"}₹{Number(row.amount).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ color: "#94a3b8", fontSize: "0.85rem", fontFamily: "monospace" }}>{row.upi_id}</TableCell>
                        <TableCell>{row.screenshot_url ? <a href={row.screenshot_url} target="_blank" rel="noreferrer" style={{ color: "#4cb4c4" }}>View</a> : "—"}</TableCell>
                        <TableCell>
                          <Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                              select
                              size="small"
                              defaultValue={row.status}
                              sx={{ minWidth: 120 }}
                              onChange={(event) => updateStatus(row.id, event.target.value)}
                            >
                              {statuses.map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                              ))}
                            </TextField>
                            <Button size="small" variant="outlined" onClick={() => updateStatus(row.id, "APPROVED")}>Approve</Button>
                            <Button size="small" sx={{ background: "rgba(76,180,196,0.15)", color: "#4cb4c4" }} variant="contained" onClick={() => updateStatus(row.id, "PAID")}>Paid</Button>
                          </Stack>
                        </TableCell>
                      </MotionTableRow>
                    );
                  })}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                        No withdrawal requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </motion.div>
    </Box>
  );
};

export default WithdrawalsPage;
