import { useEffect, useState } from "react";
import {
  Alert,
  Box,
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
  Typography,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { RiCoinsFill, RiGroupFill, RiLoader2Fill, RiWallet3Fill } from "react-icons/ri";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { PageSkeleton, CardSkeleton } from "../../components/common/SkeletonLoader";
import { adminApi } from "../../lib/adminApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);

const withdrawalStatusConfig = {
  PENDING: { label: "Pending", bg: "rgba(153,92,0,0.15)", color: "#ff9f1c" },
  APPROVED: { label: "Approved", bg: "rgba(0,168,84,0.15)", color: "#00a854" },
  REJECTED: { label: "Rejected", bg: "rgba(211,47,47,0.15)", color: "#d32f2f" },
  PAID: { label: "Paid", bg: "rgba(76,180,196,0.15)", color: "#4cb4c4" },
};

const userStatusConfig = {
  ACTIVE: { label: "Active", bg: "rgba(0,168,84,0.15)", color: "#00a854" },
  BLOCKED: { label: "Blocked", bg: "rgba(211,47,47,0.15)", color: "#d32f2f" },
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data: response } = await adminApi.getDashboard();
        setData(response?.data || null);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <PageSkeleton cards={4} lines={5} />;
  }

  const renderWithdrawalRow = (item, isMobile = false) => {
    const statusCfg = withdrawalStatusConfig[item.status] || withdrawalStatusConfig.PENDING;
    if (isMobile) {
      return (
        <Box key={item.id} py={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600} fontSize={13} color="#e2e8f0">{item.name}</Typography>
            <Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none", fontSize: "0.65rem" }} />
          </Stack>
          <Typography fontSize={14} fontWeight={700} sx={{ color: "#00a854" }} mt={0.5}>₹{Number(item.amount).toFixed(2)}</Typography>
        </Box>
      );
    }
    return (
      <TableRow key={item.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
        <TableCell sx={{ fontSize: "0.875rem" }}>{item.name}</TableCell>
        <TableCell sx={{ color: "#00a854", fontWeight: 700, fontSize: "0.875rem" }}>₹{Number(item.amount).toFixed(2)}</TableCell>
        <TableCell><Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }} /></TableCell>
      </TableRow>
    );
  };

  const renderUserRow = (item, isMobile = false) => {
    const statusCfg = userStatusConfig[item.status] || userStatusConfig.ACTIVE;
    if (isMobile) {
      return (
        <Box key={item.id} py={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600} fontSize={13} color="#e2e8f0">{item.name}</Typography>
            <Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none", fontSize: "0.65rem" }} />
          </Stack>
          <Typography fontSize={12} color="#64748b" fontFamily="monospace" mt={0.3}>{item.email}</Typography>
        </Box>
      );
    }
    return (
      <TableRow key={item.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
        <TableCell sx={{ fontSize: "0.875rem" }}>{item.name}</TableCell>
        <TableCell sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>{item.email}</TableCell>
        <TableCell><Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }} /></TableCell>
      </TableRow>
    );
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Admin Dashboard" subtitle="Monitor due payouts, pending requests, and growth insights." chip="Admin Control" />
      </motion.div>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={3}>
          <Grid item xs={6} lg={3}><StatCard label="Total Due Payments" value={`₹${Number(data?.stats?.totalDuePayments || 0).toFixed(2)}`} hint="Approved not paid" icon={<RiWallet3Fill />} color="#0a5f61" /></Grid>
          <Grid item xs={6} lg={3}><StatCard label="Pending Requests" value={data?.stats?.totalPendingRequests || 0} hint="Withdrawal queue" icon={<RiLoader2Fill />} color="#4cb4c4" /></Grid>
          <Grid item xs={6} lg={3}><StatCard label="Total Users" value={data?.stats?.totalUsers || 0} hint="Registered earners" icon={<RiGroupFill />} color="#00a854" /></Grid>
          <Grid item xs={6} lg={3}><StatCard label="Total Paid" value={`₹${Number(data?.stats?.totalPaid || 0).toFixed(2)}`} hint="Released payouts" icon={<RiCoinsFill />} color="#ff9f1c" /></Grid>
        </Grid>
      </motion.div>

      <Grid container spacing={{ xs: 2, sm: 2 }}>
        <Grid item xs={12} lg={4}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <MotionCard
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
                border: "1px solid rgba(10,95,97,0.12)",
              }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
            >
              <Box px={2} py={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", color: "#e2e8f0" }}>Recent Withdrawals</Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
              <Box px={2} pb={1}>
                {data?.recentWithdrawals?.length > 0 ? (
                  <>
                    <Box sx={{ display: { xs: "block", md: "none" } }}>
                      {data.recentWithdrawals.slice(0, 6).map((item) => renderWithdrawalRow(item, true))}
                    </Box>
                    <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
                      <Table size="small">
                        <TableHead><TableRow><TableCell>User</TableCell><TableCell>Amount</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                        <TableBody>
                          {data.recentWithdrawals.slice(0, 6).map((item) => renderWithdrawalRow(item, false))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Box py={3} textAlign="center"><Typography color="#64748b" fontSize={13}>No withdrawals yet</Typography></Box>
                )}
              </Box>
            </MotionCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MotionCard
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
                border: "1px solid rgba(10,95,97,0.12)",
              }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
            >
              <Box px={2} py={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", color: "#e2e8f0" }}>Recent Users</Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
              <Box px={2} pb={1}>
                {data?.newUsers?.length > 0 ? (
                  <>
                    <Box sx={{ display: { xs: "block", md: "none" } }}>
                      {data.newUsers.slice(0, 6).map((item) => renderUserRow(item, true))}
                    </Box>
                    <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
                      <Table size="small">
                        <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                        <TableBody>
                          {data.newUsers.slice(0, 6).map((item) => renderUserRow(item, false))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Box py={3} textAlign="center"><Typography color="#64748b" fontSize={13}>No new users yet</Typography></Box>
                )}
              </Box>
            </MotionCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <MotionCard
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(160deg, #0b1120, #0d1525, #101a2f)",
                border: "1px solid rgba(10,95,97,0.12)",
              }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
            >
              <Box px={2} py={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", color: "#e2e8f0" }}>Task Overview</Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
              <Box px={2} pb={2}>
                <Stack direction="row" spacing={2} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, background: "rgba(0,168,84,0.06)", border: "1px solid rgba(0,168,84,0.12)" }}>
                    <Typography variant="caption" color="text.secondary">Active Tasks</Typography>
                    <Typography variant="h5" sx={{ color: "#00a854", fontWeight: 700 }}>{data?.recentTasks?.filter(t => t.is_active)?.length || 0}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, background: "rgba(211,47,47,0.06)", border: "1px solid rgba(211,47,47,0.12)" }}>
                    <Typography variant="caption" color="text.secondary">Inactive Tasks</Typography>
                    <Typography variant="h5" sx={{ color: "#d32f2f", fontWeight: 700 }}>{data?.recentTasks?.filter(t => !t.is_active)?.length || 0}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, background: "rgba(76,180,196,0.06)", border: "1px solid rgba(76,180,196,0.12)" }}>
                    <Typography variant="caption" color="text.secondary">Total Tasks</Typography>
                    <Typography variant="h5" sx={{ color: "#4cb4c4", fontWeight: 700 }}>{data?.recentTasks?.length || 0}</Typography>
                  </Box>
                </Stack>
              </Box>
            </MotionCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
