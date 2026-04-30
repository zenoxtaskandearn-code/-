import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { CardSkeleton } from "../../components/common/SkeletonLoader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);

const categories = ["", "YouTube", "Instagram", "Twitter/X", "Telegram", "Discord", "Website Visit", "App Install", "Survey", "Referral", "Other"];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ category: "", search: "" });

  const loadTasks = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await userApi.getTasks(params);
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

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const onApply = () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    loadTasks(params);
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <PageHeader title="Tasks" subtitle="Explore high-conversion task campaigns and complete more for better rewards." chip="Task Feed" />
      </motion.div>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, mb: 2.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.3}>
            <TextField label="Search task" name="search" value={filters.search} onChange={onFilterChange} fullWidth size="small" />
            <TextField select label="Category" name="category" value={filters.category} onChange={onFilterChange} sx={{ minWidth: { xs: "100%", md: 190 } }} size="small">
              {categories.map((category) => (
                <MenuItem value={category} key={category || "ALL"}>
                  {category || "All Categories"}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={onApply} sx={{ minWidth: { xs: "100%", sm: "auto" } }}>Apply</Button>
          </Stack>
        </Card>
      </motion.div>

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}><CardSkeleton /></Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task, index) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
              >
                <MotionCard
                  sx={{ borderRadius: 3, height: "100%", overflow: "hidden" }}
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(15,139,141,0.12), 0 0 0 1px rgba(15,139,141,0.08)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Chip label={task.category} size="small" sx={{ background: "rgba(15,139,141,0.12)", color: "#4cb4c4", border: "1px solid rgba(15,139,141,0.2)", fontWeight: 600 }} />
                      <Chip size="small" label={`+₹${Number(task.reward_amount).toFixed(2)}`} sx={{ background: "rgba(0,230,118,0.1)", color: "#00e676", fontWeight: 700, border: "none" }} />
                    </Stack>
                    <Typography variant="h6" mb={0.7} sx={{ fontWeight: 600 }}>{task.title}</Typography>
                    <Typography color="text.secondary" mb={1.4} sx={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                      {task.description?.slice(0, 110)}...
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={task.max_users > 0 ? 1.2 : 0}>
                      <Typography variant="body2" color="text.secondary">{task.completed_count} completed</Typography>
                      <Button component={Link} to={`/app/tasks/${task.id}`} size="small" variant="contained" sx={{ px: 2 }}>
                        View Task
                      </Button>
                    </Stack>
                    {task.max_users > 0 && (() => {
                      const remaining = Math.max(0, task.max_users - task.completed_count);
                      const pct = (task.completed_count / task.max_users) * 100;
                      return (
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography fontSize={11} color={remaining === 0 ? "#d32f2f" : "#94a3b8"} fontWeight={500}>
                              {remaining === 0 ? "Task Full — No slots left" : `${remaining} / ${task.max_users} slots remaining`}
                            </Typography>
                            <Typography fontSize={11} color="#64748b" fontWeight={600}>{Math.round(pct)}%</Typography>
                          </Stack>
                          <Box sx={{ width: "100%", height: 4, borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <Box
                              sx={{
                                width: `${pct}%`,
                                height: "100%",
                                borderRadius: 2,
                                background: remaining === 0
                                  ? "linear-gradient(90deg, #d32f2f, #b71c1c)"
                                  : pct > 80
                                  ? "linear-gradient(90deg, #ff9f1c, #cc7a00)"
                                  : "linear-gradient(90deg, #00a854, #008c44)",
                                transition: "width 0.5s ease",
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })()}
                  </CardContent>
                </MotionCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TasksPage;
