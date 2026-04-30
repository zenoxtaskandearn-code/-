import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
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

const userStatusConfig = {
  ACTIVE: { label: "Active", bg: "rgba(0,168,84,0.15)", color: "#00a854" },
  BLOCKED: { label: "Blocked", bg: "rgba(211,47,47,0.15)", color: "#d32f2f" },
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers();
      setUsers(data?.data?.users || []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  const toggleStatus = async (id, nextStatus) => {
    try {
      await adminApi.updateUserStatus(id, { status: nextStatus });
      await loadUsers();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  const renderMobileCard = (user, index) => {
    const statusCfg = userStatusConfig[user.status] || userStatusConfig.ACTIVE;
    const isBlockable = user.role !== "ADMIN";

    return (
      <MotionCard
        key={user.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 + index * 0.04 }}
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
              <Typography fontWeight={700} fontSize={15} color="#e2e8f0">{user.name}</Typography>
              <Typography color="#64748b" fontSize={12} fontFamily="monospace">{user.email}</Typography>
            </Box>
            <Stack direction="row" spacing={0.8}>
              <Chip
                label={user.role}
                size="small"
                sx={{
                  background: user.role === "ADMIN" ? "rgba(153,92,0,0.15)" : "rgba(76,180,196,0.15)",
                  color: user.role === "ADMIN" ? "#ff9f1c" : "#4cb4c4",
                  fontWeight: 600,
                  border: "none",
                }}
              />
              <Chip
                label={statusCfg.label}
                size="small"
                sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 1.2 }} />

          <Grid container spacing={1.5} mb={1.5}>
            <Grid item xs={6}>
              <Typography fontSize={11} color="#64748b" fontWeight={500}>Phone</Typography>
              <Typography fontSize={13} color="#94a3b8" fontFamily="monospace">{user.phone || "—"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontSize={11} color="#64748b" fontWeight={500}>Profession</Typography>
              <Typography fontSize={13} color="#94a3b8">{user.profession || "—"}</Typography>
            </Grid>
          </Grid>

          {isBlockable ? (
            <Button
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: user.status === "ACTIVE" ? "#d32f2f" : "#00a854",
                color: user.status === "ACTIVE" ? "#d32f2f" : "#00a854",
                "&:hover": {
                  borderColor: user.status === "ACTIVE" ? "#b71c1c" : "#008c44",
                  backgroundColor: user.status === "ACTIVE" ? "rgba(211,47,47,0.08)" : "rgba(0,168,84,0.08)",
                },
              }}
              onClick={() => toggleStatus(user.id, user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE")}
            >
              {user.status === "ACTIVE" ? "Block User" : "Activate User"}
            </Button>
          ) : (
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2,
                background: "rgba(153,92,0,0.08)",
                border: "1px solid rgba(153,92,0,0.15)",
                textAlign: "center",
              }}
            >
              <Typography fontSize={12} color="#ff9f1c" fontWeight={600}>Admin Protected</Typography>
            </Box>
          )}
        </Box>
      </MotionCard>
    );
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Manage Users" subtitle="Search users, review profile details, and control account status." chip="User Admin" />
      </motion.div>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, mb: 2, background: "linear-gradient(160deg, #0b1120, #0d1525)", border: "1px solid rgba(10,95,97,0.1)" }}>
          <TextField label="Search by name, email, or phone" fullWidth value={query} onChange={(event) => setQuery(event.target.value)} size="small" />
        </Card>
      </motion.div>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {loading ? (
          <Grid container spacing={1.5}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} key={i}><CardSkeleton /></Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={1.5}>
            {filtered.map((user, index) => renderMobileCard(user, index))}
            {filtered.length === 0 && (
              <Card sx={{ p: 4, borderRadius: 3, textAlign: "center", background: "linear-gradient(160deg, #0b1120, #0d1525)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography color="#64748b">No users found.</Typography>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Profession</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((user, index) => {
                    const statusCfg = userStatusConfig[user.status] || userStatusConfig.ACTIVE;
                    return (
                      <MotionTableRow
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.04 }}
                      >
                        <TableCell><Typography fontWeight={600} sx={{ fontSize: "0.9rem" }}>{user.name}</Typography></TableCell>
                        <TableCell sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>{user.email}</TableCell>
                        <TableCell sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>{user.phone}</TableCell>
                        <TableCell sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>{user.profession}</TableCell>
                        <TableCell><Chip label={user.role} size="small" sx={{ background: user.role === "ADMIN" ? "rgba(153,92,0,0.15)" : "rgba(76,180,196,0.15)", color: user.role === "ADMIN" ? "#ff9f1c" : "#4cb4c4", fontWeight: 600, border: "none" }} /></TableCell>
                        <TableCell><Chip label={statusCfg.label} size="small" sx={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, border: "none" }} /></TableCell>
                        <TableCell>
                          {user.role === "ADMIN" ? (
                            <Typography fontSize={12} color="text.secondary">Protected</Typography>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: user.status === "ACTIVE" ? "#d32f2f" : "#00a854", color: user.status === "ACTIVE" ? "#d32f2f" : "#00a854" }}
                              onClick={() => toggleStatus(user.id, user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE")}
                            >
                              {user.status === "ACTIVE" ? "Block" : "Activate"}
                            </Button>
                          )}
                        </TableCell>
                      </MotionTableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                        No users found.
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

export default ManageUsersPage;
