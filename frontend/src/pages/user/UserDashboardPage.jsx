import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  RiBankFill,
  RiCheckboxCircleFill,
  RiMoneyDollarCircleFill,
  RiWallet3Fill,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import { PageSkeleton, CardSkeleton } from "../../components/common/SkeletonLoader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);

const statusConfig = {
  COMPLETED: { label: "Approved", color: "success", bg: "rgba(0,168,84,0.1)", border: "rgba(0,230,118,0.25)" },
  STARTED: { label: "In Progress", color: "warning", bg: "rgba(255,159,28,0.1)", border: "rgba(255,159,28,0.25)" },
  NOT_STARTED: { label: "New", color: "default", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.15)" },
};

const reviewConfig = {
  APPROVED: { label: "Approved", bg: "rgba(0,230,118,0.12)", color: "#00e676" },
  PENDING: { label: "Under Review", bg: "rgba(255,159,28,0.12)", color: "#ff9f1c" },
  REJECTED: { label: "Rejected", bg: "rgba(255,82,82,0.12)", color: "#ff5252" },
};

const UserDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ stats: null, tasks: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: response } = await userApi.getDashboard();
        setData(response?.data || { stats: null, tasks: [] });
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <PageSkeleton cards={3} lines={4} />;
  }

  return (
    <Box>
      <PageHeader
        title="User Dashboard"
        subtitle="Track rewards, monitor progress, and jump into fresh tasks."
        chip="Live Earnings"
      />

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Grid container spacing={{ xs: 1.5, sm: 2.2 }} mb={{ xs: 2, sm: 3 }}>
        <Grid item xs={6} lg={3}>
          <StatCard label="Wallet Balance" value={`₹${Number(data.stats?.walletBalance || 0).toFixed(2)}`} hint="Available for withdrawal" icon={<RiWallet3Fill />} color="#0f8b8d" />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard label="Tasks Completed" value={data.stats?.totalTasksCompleted || 0} hint="Total finished tasks" icon={<RiCheckboxCircleFill />} color="#4cb4c4" />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard label="Total Earned" value={`₹${Number(data.stats?.totalEarned || 0).toFixed(2)}`} hint="All-time reward credited" icon={<RiMoneyDollarCircleFill />} color="#00e676" />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard label="Total Withdrawn" value={`₹${Number(data.stats?.totalWithdrawn || 0).toFixed(2)}`} hint="Paid withdrawals" icon={<RiBankFill />} color="#ff9f1c" />
        </Grid>
      </Grid>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} mb={3}>
        <Button component={Link} to="/app/wallet" variant="contained" color="secondary" sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
          Withdraw
        </Button>
        <Button component={Link} to="/app/history" variant="outlined" sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
          See History
        </Button>
      </Stack>

      <Typography variant="h5" mb={1.5}>
        Active Tasks
      </Typography>
      <Grid container spacing={2}>
        {data.tasks?.map((task, index) => {
          const status = statusConfig[task.my_status] || statusConfig.NOT_STARTED;
          const review = reviewConfig[task.review_status] || null;
          return (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <MotionCard
                  sx={{ borderRadius: 3, height: "100%", p: 0, overflow: "hidden" }}
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(15,139,141,0.12), 0 0 0 1px rgba(15,139,141,0.08)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.2}>
                      <Chip label={task.category} size="small" sx={{ background: "rgba(15,139,141,0.12)", color: "#4cb4c4", border: "1px solid rgba(15,139,141,0.2)", fontWeight: 600 }} />
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        {review && (
                          <Chip label={review.label} size="small" sx={{ background: review.bg, color: review.color, border: "none", fontWeight: 600 }} />
                        )}
                        <Chip label={status.label} size="small" sx={{ background: status.bg, color: status.color === "default" ? "#94a3b8" : `var(--mui-palette-${status.color}-main)`, border: `1px solid ${status.border}`, fontWeight: 600 }} />
                      </Stack>
                    </Stack>
                    <Typography variant="h6" mb={0.5} sx={{ fontWeight: 600 }}>{task.title}</Typography>
                    <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                      <Typography sx={{ color: "#00e676", fontWeight: 700, fontSize: "1.05rem" }}>+₹{Number(task.reward_amount).toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">· {task.completed_count} completed</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Button component={Link} to={`/app/tasks/${task.id}`} size="small" variant="contained" sx={{ px: 2 }}>
                        View Task
                      </Button>
                    </Stack>
                  </Box>
                </MotionCard>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default UserDashboardPage;
