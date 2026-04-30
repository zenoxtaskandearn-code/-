import { Box, Button, Card, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaShieldAlt, FaChartLine, FaHeart, FaBullseye, FaHandshake, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const values = [
  { icon: <FaRocket />, title: "Innovation First", desc: "Constantly evolving our platform with cutting-edge tech to deliver the best earning experience.", color: "#0f8b8d" },
  { icon: <FaHeart />, title: "User Centric", desc: "Every feature we build starts with one question: how does this help our earners succeed?", color: "#f472b6" },
  { icon: <FaShieldAlt />, title: "Trust & Transparency", desc: "100% transparent payouts, no hidden fees. What you earn is what you get, always.", color: "#4cb4c4" },
  { icon: <FaBullseye />, title: "Result Driven", desc: "We measure success by your success. More earners earning more = we're doing it right.", color: "#ff9f1c" },
  { icon: <FaHandshake />, title: "Fair Partnerships", desc: "We work with verified advertisers who pay well. You deserve quality tasks, not spam.", color: "#a78bfa" },
  { icon: <FaAward />, title: "Quality Tasks", desc: "Every task is reviewed and verified before it reaches you. No junk, only legitimate work.", color: "#34d399" },
];

const stats = [
  { value: "12,400+", label: "Active Earners", icon: <FaUsers />, color: "#0f8b8d" },
  { value: "₹50L+", label: "Total Paid Out", icon: <FaChartLine />, color: "#ff9f1c" },
  { value: "68,000+", label: "Tasks Completed", icon: <FaRocket />, color: "#34d399" },
  { value: "99.2%", label: "Approval Rate", icon: <FaShieldAlt />, color: "#a78bfa" },
];

const AboutPage = () => {
  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* Hero */}
      <Box sx={{ position: "relative", pt: { xs: "100px", md: "120px" }, pb: { xs: 8, md: 12 }, background: "#0b1120", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(15,139,141,0.12) 0%, transparent 60%)" }} />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 3, px: 2, py: 0.8, borderRadius: 50, background: "rgba(15,139,141,0.1)", border: "1px solid rgba(15,139,141,0.2)" }}>
              <MotionBox animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} sx={{ width: 6, height: 6, borderRadius: "50%", background: "#4cb4c4" }} />
              <Typography fontSize={11} fontWeight={700} color="#4cb4c4" textTransform="uppercase" letterSpacing="0.1em">About Zenox</Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: 28, sm: 36, md: 48 }, fontWeight: 900, color: "#f9fafb", mb: 2, letterSpacing: "-0.02em" }}>
              We Build Earning Opportunities
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: { xs: 14, md: 17 }, maxWidth: 600, mx: "auto", lineHeight: 1.7, mb: 4 }}>
              Zenox is India&apos;s trusted task earning platform. We connect verified advertisers with motivated earners, creating a win-win ecosystem.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button component={Link} to="/register" variant="contained" endIcon={<FiArrowRight />} sx={{ background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", px: 4, py: 1.4, fontSize: 14, borderRadius: 1, fontWeight: 700, "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(15,139,141,0.4)" }, transition: "all 0.3s ease" }}>Join Zenox</Button>
              <Button component={Link} to="/contact" variant="outlined" sx={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)", px: 4, py: 1.4, fontSize: 14, borderRadius: 1, "&:hover": { borderColor: "#0f8b8d", color: "#4cb4c4" }, transition: "all 0.3s ease" }}>Contact Us</Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ py: 6, background: "#0d1a2d" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <MotionCard whileHover={{ y: -4 }} sx={{ p: 3, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", transition: "all 0.3s ease" }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: "50%", background: `${s.color}10`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5, fontSize: 18, color: s.color }}>{s.icon}</Box>
                  <Typography fontWeight={800} fontSize={{ xs: 22, md: 28 }} sx={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</Typography>
                  <Typography fontSize={12} color="text.secondary" mt={0.3}>{s.label}</Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Story */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#0b1120" }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography sx={{ fontSize: { xs: 22, md: 32 }, fontWeight: 800, color: "#f9fafb", mb: 2, letterSpacing: "-0.01em" }}>Our Story</Typography>
            <Typography color="text.secondary" fontSize={15} lineHeight={1.8} mb={2}>
              Zenox was born from a simple observation: millions of people in India spend hours on their phones daily, yet most digital earning platforms are either scams, pay pennies, or require impossible investments.
            </Typography>
            <Typography color="text.secondary" fontSize={15} lineHeight={1.8} mb={2}>
              We set out to change that. Zenox is built on the principle that everyone deserves a fair chance to earn from their phone. We partner directly with verified brands and app developers, bringing you legitimate tasks with real payouts.
            </Typography>
            <Typography color="text.secondary" fontSize={15} lineHeight={1.8}>
              Every task you see has been reviewed. Every payment you earn is tracked in real-time. And every withdrawal request is processed within 24 hours. That&apos;s our promise.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Values */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#0d1a2d" }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography sx={{ fontSize: { xs: 22, md: 32 }, fontWeight: 800, color: "#f9fafb", mb: 1, letterSpacing: "-0.01em", textAlign: "center" }}>Our Values</Typography>
            <Typography color="text.secondary" textAlign="center" fontSize={14} mb={6}>What drives us every day</Typography>
          </motion.div>
          <Grid container spacing={2}>
            {values.map((v, i) => (
              <Grid item xs={12} sm={6} md={4} key={v.title}>
                <MotionCard initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5, boxShadow: `0 12px 40px ${v.color}12` }} sx={{ p: 3, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: `1px solid ${v.color}10`, transition: "all 0.3s ease" }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 1.5, background: `${v.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: v.color, mb: 2 }}>{v.icon}</Box>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={16} mb={0.8}>{v.title}</Typography>
                  <Typography color="text.secondary" fontSize={13} lineHeight={1.6}>{v.desc}</Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#0b1120" }}>
        <Container maxWidth="md">
          <MotionCard initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ p: { xs: 4, md: 6 }, borderRadius: 3, background: "linear-gradient(135deg, rgba(15,139,141,0.08), rgba(17,24,39,0.9))", border: "1px solid rgba(15,139,141,0.15)", textAlign: "center" }}>
            <Typography fontWeight={800} fontSize={{ xs: 24, md: 34 }} color="#f9fafb" mb={2}>Ready to Start Earning?</Typography>
            <Typography color="rgba(255,255,255,0.55)" fontSize={15} mb={4} maxWidth={450} mx="auto" lineHeight={1.7}>Join 12,000+ earners who&apos;ve already discovered a better way to earn from their phone.</Typography>
            <Button component={Link} to="/register" variant="contained" endIcon={<FiArrowRight />} sx={{ background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", px: 5, py: 1.5, fontSize: 15, borderRadius: 1, fontWeight: 700, "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(15,139,141,0.4)" }, transition: "all 0.3s ease" }}>Create Free Account</Button>
          </MotionCard>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
