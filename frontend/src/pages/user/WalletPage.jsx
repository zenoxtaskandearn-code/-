import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { TableSkeleton, FormSkeleton } from "../../components/common/SkeletonLoader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";
import { RiBankFill, RiUploadCloud2Fill, RiWallet3Fill } from "react-icons/ri";

const MotionCard = motion.create(Card);
const MotionTableRow = motion.create(TableRow);

const withdrawalStatusConfig = {
  PENDING: { label: "Pending", bg: "rgba(255,159,28,0.12)", color: "#ff9f1c" },
  APPROVED: { label: "Approved", bg: "rgba(0,230,118,0.12)", color: "#00e676" },
  REJECTED: { label: "Rejected", bg: "rgba(255,82,82,0.12)", color: "#ff5252" },
  PAID: { label: "Paid", bg: "rgba(76,180,196,0.12)", color: "#4cb4c4" },
};

const transactionConfig = {
  TASK_REWARD: { icon: "+", color: "#00e676" },
  WITHDRAW_REQUEST: { icon: "−", color: "#ff5252" },
  WITHDRAW_REVERSED: { icon: "+", color: "#4cb4c4" },
};

const WalletPage = () => {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({ wallet: {}, transactions: [], withdrawals: [] });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [withdrawForm, setWithdrawForm] = useState({ upiId: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getWallet();
      setWalletData(data?.data || { wallet: {}, transactions: [], withdrawals: [] });
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await userApi.createWithdrawal({ upiId: withdrawForm.upiId, amount: withdrawForm.amount });
      setMessage("Withdrawal request submitted.");
      setWithdrawForm({ upiId: "", amount: "" });
      await loadWallet();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Wallet" subtitle="Managing your balance and withdrawals..." chip="Wallet Center" />
        <Grid container spacing={2} mb={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box sx={{ p: 2, borderRadius: 3, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Box sx={{ height: 12, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.06)", mb: 1.5 }} />
                <Box sx={{ height: 24, width: "45%", borderRadius: 2, background: "rgba(255,255,255,0.06)", mb: 0.8 }} />
                <Box sx={{ height: 10, width: "40%", borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
              </Box>
            </Grid>
          ))}
        </Grid>
        <FormSkeleton />
        <TableSkeleton rows={5} />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Wallet" subtitle="Manage balance, submit withdrawals, and view transaction history." chip="Wallet Center" />
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

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={3}>
          <Grid item xs={6} md={4}>
            <StatCard label="Available Balance" value={`₹${Number(walletData.wallet?.balance || 0).toFixed(2)}`} hint="Ready to withdraw" icon={<RiWallet3Fill />} color="#0f8b8d" />
          </Grid>
          <Grid item xs={6} md={4}>
            <StatCard label="Total Earned" value={`₹${Number(walletData.wallet?.total_earned || 0).toFixed(2)}`} hint="Lifetime credited" icon={<RiUploadCloud2Fill />} color="#00e676" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Total Withdrawn" value={`₹${Number(walletData.wallet?.total_withdrawn || 0).toFixed(2)}`} hint="Paid to account" icon={<RiBankFill />} color="#ff9f1c" />
          </Grid>
        </Grid>
      </motion.div>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <MotionCard sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 3, height: "100%" }}>
              <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>Create Withdrawal Request</Typography>
              <Box component="form" onSubmit={submitWithdrawal}>
                <Stack spacing={1.6}>
                  <TextField label="UPI ID" value={withdrawForm.upiId} onChange={(event) => setWithdrawForm((p) => ({ ...p, upiId: event.target.value }))} required fullWidth />
                  <TextField label="Amount" type="number" value={withdrawForm.amount} onChange={(event) => setWithdrawForm((p) => ({ ...p, amount: event.target.value }))} required fullWidth />
                  <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                    {submitting ? "Submitting..." : "Submit Withdrawal"}
                  </Button>
                </Stack>
              </Box>
            </MotionCard>
          </motion.div>
        </Grid>
      </Grid>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <MotionCard sx={{ borderRadius: 3, mb: 2, overflow: "hidden" }}>
          <Box px={{ xs: 1.5, sm: 2.5 }} py={2}><Typography variant="h6" sx={{ fontWeight: 600 }}>Withdrawal History</Typography></Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>UPI ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {walletData.withdrawals?.map((item, index) => {
                  const statusCfg = withdrawalStatusConfig[item.status] || withdrawalStatusConfig.PENDING;
                  return (
                    <MotionTableRow
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 + index * 0.04 }}
                    >
                      <TableCell sx={{ color: item.status === "REJECTED" ? "#ff5252" : "#00e676", fontWeight: 700 }}>
                        {item.status === "REJECTED" ? "−" : "+"}₹{Number(item.amount).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" }, color: "#94a3b8" }}>{item.upi_id}</TableCell>
                      <TableCell>
                        <Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }} />
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" }, color: "#94a3b8", fontSize: "0.85rem" }}>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    </MotionTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </MotionCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <MotionCard sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box px={{ xs: 1.5, sm: 2.5 }} py={2}><Typography variant="h6" sx={{ fontWeight: 600 }}>Wallet Transactions</Typography></Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Reference</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {walletData.transactions?.map((txn, index) => {
                  const txnCfg = transactionConfig[txn.type] || { icon: "", color: "#94a3b8" };
                  return (
                    <MotionTableRow
                      key={txn.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32 + index * 0.04 }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{txn.type?.replace(/_/g, " ")}</TableCell>
                      <TableCell sx={{ color: txnCfg.color, fontWeight: 700 }}>
                        {txnCfg.icon}₹{Math.abs(Number(txn.amount)).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" }, color: "#94a3b8" }}>{txn.reference_type || "—"}</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" }, color: "#94a3b8", fontSize: "0.85rem" }}>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                    </MotionTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </MotionCard>
      </motion.div>
    </Box>
  );
};

export default WalletPage;
