import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FiCopy, FiLink, FiRefreshCw, FiShare2, FiUsers } from "react-icons/fi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { CardSkeleton } from "../../components/common/SkeletonLoader";
import { userApi } from "../../lib/userApi";
import { getErrorMessage } from "../../lib/errors";

const MotionCard = motion.create(Card);

const ReferralPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: response } = await userApi.getReferralStats();
      setData(response?.data || null);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data?.referralCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/register?ref=${data?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `Join Zenox and earn money by completing tasks! Use my referral code: ${data?.referralCode}`;
    const link = `${window.location.origin}/register?ref=${data?.referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Zenox - Tasks & Earn", text, url: link });
      } catch (_e) {}
    } else {
      navigator.clipboard.writeText(`${text}\n${link}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Refer & Earn" subtitle="Share your code and earn rewards when friends join." chip="Referral" />
        <Grid container spacing={{ xs: 1.5, sm: 2 }} mt={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={6} sm={4} key={i}><CardSkeleton /></Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Refer & Earn" subtitle="Share your referral code and earn rewards when friends join Zenox." chip="Referral" />
      </motion.div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={3}>
          <Grid item xs={6} sm={4}>
            <StatCard label="Your Referral Code" value={data?.referralCode || "N/A"} hint="Share this with friends" icon={<FiRefreshCw />} color="#0a5f61" />
          </Grid>
          <Grid item xs={6} sm={4}>
            <StatCard label="Total Referred" value={data?.totalReferred || 0} hint="Friends joined" icon={<FiUsers />} color="#4cb4c4" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Referral Earnings" value={`₹${Number(data?.totalEarnings || 0).toFixed(2)}`} hint={`₹${data?.rewardAmount || 0} per referral`} icon={<RiMoneyDollarCircleFill />} color="#00a854" />
          </Grid>
        </Grid>
      </motion.div>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
              <Box p={2.5}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <FiShare2 color="#4cb4c4" size={20} />
                  <Typography variant="h6" fontWeight={700} color="#e2e8f0" fontSize="1.05rem">Share & Invite</Typography>
                </Stack>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, rgba(10,95,97,0.15), rgba(76,180,196,0.05))",
                    border: "1px solid rgba(10,95,97,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    fontFamily="monospace"
                    fontWeight={700}
                    fontSize={{ xs: "1.2rem", sm: "1.4rem" }}
                    letterSpacing={3}
                    color="#4cb4c4"
                  >
                    {data?.referralCode}
                  </Typography>
                  <Tooltip title={copied ? "Copied!" : "Copy Code"}>
                    <IconButton onClick={handleCopyCode} sx={{ color: "#4cb4c4" }}>
                      <FiCopy />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />

                <TextField
                  fullWidth
                  label="Referral Link"
                  value={`${window.location.origin}/register?ref=${data?.referralCode}`}
                  InputProps={{ readOnly: true }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.03)",
                    },
                  }}
                />

                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FiLink />}
                    onClick={handleCopyLink}
                    sx={{
                      background: "linear-gradient(135deg, #0a5f61, #4cb4c4)",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "0 4px 16px rgba(10,95,97,0.3)",
                    }}
                  >
                    Copy Link
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FiShare2 />}
                    onClick={handleShare}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "rgba(10,95,97,0.3)",
                      color: "#4cb4c4",
                    }}
                  >
                    Share
                  </Button>
                </Stack>
              </Box>
            </MotionCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
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
              <Box p={2.5}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <FiUsers color="#4cb4c4" size={20} />
                  <Typography variant="h6" fontWeight={700} color="#e2e8f0" fontSize="1.05rem">Your Referrals</Typography>
                  <Chip label={data?.totalReferred || 0} size="small" sx={{ background: "rgba(10,95,97,0.15)", color: "#4cb4c4", fontWeight: 700 }} />
                </Stack>

                {data?.referredUsers?.length > 0 ? (
                  <>
                    <Box sx={{ display: { xs: "block", md: "none" } }}>
                      <Stack spacing={1.5}>
                        {data.referredUsers.map((u) => (
                          <Box
                            key={u.id}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography fontWeight={600} fontSize={14} color="#e2e8f0">{u.name}</Typography>
                              <Chip label={u.profession} size="small" sx={{ background: "rgba(153,92,0,0.15)", color: "#ff9f1c", fontWeight: 500 }} />
                            </Stack>
                            <Typography fontSize={12} color="#64748b" fontFamily="monospace" mt={0.3}>{u.email}</Typography>
                            <Typography fontSize={11} color="#94a3b8" mt={0.5}>Joined {new Date(u.created_at).toLocaleDateString()}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Profession</TableCell>
                            <TableCell>Joined</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.referredUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell><Typography fontWeight={600} fontSize={13}>{u.name}</Typography></TableCell>
                              <TableCell sx={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{u.email}</TableCell>
                              <TableCell><Chip label={u.profession} size="small" sx={{ background: "rgba(153,92,0,0.15)", color: "#ff9f1c", fontWeight: 500, fontSize: "0.7rem" }} /></TableCell>
                              <TableCell sx={{ fontSize: 12, color: "#94a3b8" }}>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Box py={4} textAlign="center">
                    <FiUsers size={40} color="#64748b" style={{ marginBottom: 12 }} />
                    <Typography color="#64748b" fontSize={14}>No referrals yet. Share your code to start earning!</Typography>
                  </Box>
                )}
              </Box>
            </MotionCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReferralPage;
