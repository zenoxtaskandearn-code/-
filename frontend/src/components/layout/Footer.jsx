import { useState } from "react";
import { Box, Container, Stack, Link, Typography, TextField, Button, InputAdornment, Divider, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaPaperPlane, FaUsers, FaRocket, FaShieldAlt, FaCoins } from "react-icons/fa";
import { RiVerifiedBadgeFill, RiMoneyDollarCircleLine, RiCustomerService2Fill } from "react-icons/ri";
import { FiCheck, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const MotionBox = motion.create(Box);

function AnimatedIcon({ children, pulse, size, color }) {
  return (
    <MotionBox
      animate={pulse ? { scale: [1, 1.15, 1] } : undefined}
      transition={pulse ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
      sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size || 16, color }}
    >
      {children}
    </MotionBox>
  );
}

const curvePaths = [
  "M0,0 C240,80 480,20 720,50 C960,80 1200,10 1440,0 L1440,60 L0,60 Z",
  "M0,0 C200,60 400,10 600,40 C800,70 1000,20 1200,50 C1350,65 1420,15 1440,30 L1440,40 L0,40 Z",
  "M0,0 C300,70 500,30 700,60 C900,90 1100,20 1440,0 L1440,30 L0,30 Z",
];

const footerLinks = {
  platform: [
    { label: "Browse Tasks", to: "/" },
    { label: "Earning Stats", to: "/" },
    { label: "Referral Program", to: "/" },
    { label: "Withdrawal Guide", to: "/" },
    { label: "Task Categories", to: "/" },
  ],
  company: [
    { label: "About Zenox", to: "/" },
    { label: "How It Works", to: "/" },
    { label: "Testimonials", to: "/" },
    { label: "Blog & Updates", to: "/" },
    { label: "Careers", to: "/" },
  ],
  support: [
    { label: "Help Center", to: "/" },
    { label: "Contact Us", to: "/" },
    { label: "Report Issue", to: "/" },
    { label: "FAQ", to: "/" },
    { label: "Community", to: "/" },
  ],
  legal: [
    { label: "Terms of Service", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Cookie Policy", to: "/" },
    { label: "Refund Policy", to: "/" },
  ],
};

const socialLinks = [
  { icon: <FaTwitter />, href: "#", label: "Twitter", color: "#1DA1F2" },
  { icon: <FaInstagram />, href: "#", label: "Instagram", color: "#E4405F" },
  { icon: <FaYoutube />, href: "#", label: "YouTube", color: "#FF0000" },
  { icon: <FaLinkedin />, href: "#", label: "LinkedIn", color: "#0A66C2" },
  { icon: <FaGithub />, href: "#", label: "GitHub", color: "#e2e8f0" },
];

const quickStats = [
  { icon: <FaUsers />, value: "12,400+", label: "Active Earners", color: "#0a5f61" },
  { icon: <RiMoneyDollarCircleLine />, value: "₹50L+", label: "Total Paid", color: "#995c00" },
  { icon: <RiVerifiedBadgeFill />, value: "68,000+", label: "Tasks Done", color: "#00a854" },
  { icon: <RiCustomerService2Fill />, value: "24/7", label: "Support", color: "#7c3aed" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <Box component="footer" sx={{ position: "relative", overflow: "hidden" }}>
      {/* Complex curve transition into footer */}
      <Box sx={{ position: "relative", background: "#060a14", lineHeight: 0 }}>
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
          {curvePaths.map((d, i) => (
            <path key={i} d={d} fill={i === 0 ? "#0b1120" : i === 1 ? "#080d18" : "#060a12"} opacity={1 - i * 0.25} />
          ))}
        </svg>
      </Box>

      {/* Footer main */}
      <Box sx={{ background: "linear-gradient(180deg, #0b1120 0%, #080d18 50%, #040710 100%)", position: "relative" }}>
        {/* Background decorations */}
        <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #0a5f61, #995c00, #0a5f61, transparent)", backgroundSize: "200% 100%" }} />
        <Box sx={{ position: "absolute", top: "10%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,95,97,0.04) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <Box sx={{ position: "absolute", bottom: "15%", right: "-5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(153,92,0,0.03) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, pt: { xs: 6, md: 8 }, pb: 3 }}>

          {/* Top: Newsletter + Quick stats */}
          <Grid container spacing={4} sx={{ mb: { xs: 5, md: 7 } }}>
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1.2} alignItems="center" mb={1.5}>
                <AnimatedIcon pulse size={14} color="#995c00"><FaRocket /></AnimatedIcon>
                <Typography fontSize={{ xs: 10, sm: 11 }} fontWeight={700} color="#995c00" textTransform="uppercase" letterSpacing="0.15em">Stay Updated</Typography>
              </Stack>
              <Typography fontSize={{ xs: 20, sm: 24, md: 28 }} fontWeight={800} color="#e2e8f0" mb={1}>Get earning tips & new tasks</Typography>
              <Typography color="#8892a0" fontSize={13} mb={3} maxWidth="480px" lineHeight={1.6}>Join 5,000+ subscribers. Weekly insights on high-paying tasks and platform updates.</Typography>

              <Box component="form" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, maxWidth: 480 }}>
                <TextField placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(10,95,97,0.3)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0a5f61" } },
                    "& input": { color: "#e2e8f0", fontSize: 14, py: 1.2 }
                  }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><FaEnvelope style={{ color: "#0a5f61", fontSize: 14 }} /></InputAdornment> }} />
                <Button variant="contained" endIcon={<FaPaperPlane />}
                  sx={{ background: "linear-gradient(135deg, #073f40, #0a5f61)", borderRadius: 1.5, px: 3, py: 1.3, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", "&:hover": { boxShadow: "0 8px 30px rgba(7,63,64,0.5)", transform: "translateY(-1px)" }, transition: "all 0.3s ease" }}>
                  Subscribe
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={1.5}>
                {quickStats.map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <MotionBox whileHover={{ y: -3 }}
                      sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.015)", border: `1px solid ${stat.color}10`, textAlign: "center", transition: "all 0.3s ease", "&:hover": { borderColor: `${stat.color}20`, background: `${stat.color}04` } }}>
                      <Box sx={{ color: stat.color, fontSize: 18, mb: 0.8 }}>{stat.icon}</Box>
                      <Typography fontWeight={800} fontSize={18} color={stat.color} lineHeight={1}>{stat.value}</Typography>
                      <Typography fontSize={10} color="#8892a0" mt={0.3}>{stat.label}</Typography>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ background: "rgba(255,255,255,0.04)", mb: 5 }} />

          {/* Links columns */}
          <Grid container spacing={4} sx={{ mb: 5 }}>
            {/* Brand column */}
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1.2} alignItems="center" mb={2}>
                <Box component="img" src="/logo.png" alt="Zenox" sx={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(10,95,97,0.25)" }} />
              <Box>
                <Typography fontFamily="'Orbitron', sans-serif" fontWeight={800} color="#4cb4c4" sx={{ fontSize: 16, letterSpacing: 2 }}>ZENOX</Typography>
                <Typography fontSize={8} color="rgba(255,255,255,0.35)" letterSpacing="0.2em">TASKS & EARN</Typography>
              </Box>
              </Stack>
              <Typography color="#8892a0" fontSize={12} lineHeight={1.7} mb={2.5}>
                India&apos;s trusted task earning platform. Complete simple tasks, earn real money, withdraw instantly to UPI.
              </Typography>

              {/* Social links */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((s) => (
                  <MotionBox key={s.label} href={s.href} target="_blank" component="a"
                    whileHover={{ y: -3, scale: 1.1 }}
                    sx={{ width: 34, height: 34, borderRadius: 1.5, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontSize: 14, transition: "all 0.3s ease", textDecoration: "none", "&:hover": { background: `${s.color}10`, borderColor: `${s.color}20` } }}>
                    {s.icon}
                  </MotionBox>
                ))}
              </Stack>
            </Grid>

            {/* Platform */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography fontSize={11} fontWeight={700} color="#0a5f61" textTransform="uppercase" letterSpacing="0.12em" mb={2}>Platform</Typography>
              <Stack spacing={0.8}>
                {footerLinks.platform.map((l) => (
                  <Link key={l.label} component={RouterLink} to={l.to} fontSize={12} color="#8892a0" sx={{ textDecoration: "none", "&:hover": { color: "#e2e8f0" }, transition: "color 0.2s" }}>
                    {l.label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Company */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography fontSize={11} fontWeight={700} color="#995c00" textTransform="uppercase" letterSpacing="0.12em" mb={2}>Company</Typography>
              <Stack spacing={0.8}>
                {footerLinks.company.map((l) => (
                  <Link key={l.label} component={RouterLink} to={l.to} fontSize={12} color="#8892a0" sx={{ textDecoration: "none", "&:hover": { color: "#e2e8f0" }, transition: "color 0.2s" }}>
                    {l.label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Support */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography fontSize={11} fontWeight={700} color="#7c3aed" textTransform="uppercase" letterSpacing="0.12em" mb={2}>Support</Typography>
              <Stack spacing={0.8}>
                {footerLinks.support.map((l) => (
                  <Link key={l.label} component={RouterLink} to={l.to} fontSize={12} color="#8892a0" sx={{ textDecoration: "none", "&:hover": { color: "#e2e8f0" }, transition: "color 0.2s" }}>
                    {l.label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography fontSize={11} fontWeight={700} color="#00a854" textTransform="uppercase" letterSpacing="0.12em" mb={2}>Contact</Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box sx={{ width: 28, height: 28, borderRadius: 1, background: "rgba(10,95,97,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a5f61", fontSize: 12, flexShrink: 0 }}><FiMail /></Box>
                  <Box>
                    <Typography fontSize={10} color="#8892a0">Email</Typography>
                    <Typography fontSize={12} color="#e2e8f0">support@zenox.in</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box sx={{ width: 28, height: 28, borderRadius: 1, background: "rgba(153,92,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#995c00", fontSize: 12, flexShrink: 0 }}><FiPhone /></Box>
                  <Box>
                    <Typography fontSize={10} color="#8892a0">Phone</Typography>
                    <Typography fontSize={12} color="#e2e8f0">+91 98XXX XXXXX</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box sx={{ width: 28, height: 28, borderRadius: 1, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed", fontSize: 12, flexShrink: 0 }}><FiMapPin /></Box>
                  <Box>
                    <Typography fontSize={10} color="#8892a0">Location</Typography>
                    <Typography fontSize={12} color="#e2e8f0">India</Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Legal links */}
              <Stack direction="row" spacing={1.5} mt={2.5} flexWrap="wrap" gap={0.5}>
                {footerLinks.legal.map((l) => (
                  <Link key={l.label} component={RouterLink} to={l.to} fontSize={10} color="#8892a0" sx={{ textDecoration: "none", "&:hover": { color: "#e2e8f0" }, transition: "color 0.2s" }}>
                    {l.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ background: "rgba(255,255,255,0.04)", mb: 3 }} />

          {/* Bottom bar */}
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography fontSize={12} color="#8892a0">&copy; {new Date().getFullYear()} Zenox - Tasks & Earn</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1.5, py: 0.5, borderRadius: 1, background: "rgba(0,168,84,0.06)", border: "1px solid rgba(0,168,84,0.1)" }}>
                <FiCheck style={{ color: "#00a854", fontSize: 10 }} />
                <Typography fontSize={10} color="#00a854" fontWeight={600}>SSL Secured</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <FaShieldAlt style={{ color: "#0a5f61", fontSize: 12 }} />
                <Typography fontSize={11} color="#8892a0">Privacy First</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <FaCoins style={{ color: "#995c00", fontSize: 12 }} />
                <Typography fontSize={11} color="#8892a0">Instant Payouts</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Bottom curve */}
      <Box sx={{ position: "relative", background: "#040710", lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
          <path d="M0,60 C360,10 720,50 1080,20 C1260,10 1380,40 1440,30 L1440,0 L0,0 Z" fill="#0b1120" />
          <path d="M0,60 C300,20 600,40 900,15 C1100,5 1300,35 1440,20 L1440,0 L0,0 Z" fill="#0b1120" opacity="0.5" />
        </svg>
      </Box>
    </Box>
  );
};

export default Footer;
