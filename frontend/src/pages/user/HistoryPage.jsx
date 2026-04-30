import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const MotionTableRow = motion.create(TableRow);

const reviewStatusConfig = {
  APPROVED: { label: "Approved", bg: "rgba(0,230,118,0.12)", color: "#00e676" },
  PENDING: { label: "Under Review", bg: "rgba(255,159,28,0.12)", color: "#ff9f1c" },
  REJECTED: { label: "Rejected", bg: "rgba(255,82,82,0.12)", color: "#ff5252" },
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await userApi.getHistory();
        setHistory(data?.data?.history || []);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Task History" subtitle="All completed tasks and credited reward timeline." chip="History" />
      </motion.div>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Category</TableCell>
                    <TableCell>Reward</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item, index) => {
                    const reviewCfg = reviewStatusConfig[item.review_status] || reviewStatusConfig.APPROVED;
                    return (
                      <MotionTableRow
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + index * 0.04 }}
                      >
                        <TableCell>
                          <Typography fontWeight={600} sx={{ fontSize: "0.95rem" }}>{item.title}</Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" }, color: "#94a3b8" }}>{item.category}</TableCell>
                        <TableCell sx={{ color: "#00e676", fontWeight: 700 }}>+₹{Number(item.reward_amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip label={reviewCfg.label} size="small" sx={{ background: reviewCfg.bg, color: reviewCfg.color, fontWeight: 600, border: "none" }} />
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" }, color: "#94a3b8", fontSize: "0.85rem" }}>{new Date(item.completed_at).toLocaleDateString()}</TableCell>
                      </MotionTableRow>
                    );
                  })}
                  {history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                        No completed tasks yet.
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

export default HistoryPage;
