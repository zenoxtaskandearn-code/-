import { useState, useEffect } from "react";
import { AppBar, Box, Button, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Toolbar, Typography, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiArrowRight, FiTrendingUp, FiUsers } from "react-icons/fi";
import { FaBolt } from "react-icons/fa";

const MotionBox = motion.create(Box);

const PublicHeader = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const stats = [
    { icon: <FiUsers />, value: "12K+", label: "Earners" },
    { icon: <FiTrendingUp />, value: "₹50L+", label: "Paid Out" },
  ];

  return (
    <>
      {/* Top announcement bar */}
      <Box sx={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1299,
        background: "linear-gradient(90deg, #073f40, #0a5f61, #995c00, #073f40)",
        backgroundSize: "300% 100%",
        animation: "gradientSlide 6s linear infinite",
        py: 0.6, textAlign: "center",
        "@keyframes gradientSlide": { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "300% 50%" } }
      }}>
        <Typography fontSize={{ xs: 10, sm: 11 }} fontWeight={700} color="#fff" letterSpacing="0.05em">
          India&apos;s #1 Task Platform — Zero Investment, Instant UPI Payouts — <Box component="span" sx={{ textDecoration: "underline", cursor: "pointer" }}>Join Now</Box>
        </Typography>
      </Box>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 26,
          background: scrolled ? "rgba(6,10,20,0.97)" : "rgba(6,10,20,0.8)",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(10,95,97,0.15)" : "1px solid rgba(255,255,255,0.03)",
          color: "#e2e8f0",
          zIndex: 1300,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Animated gradient line at bottom */}
        <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #0a5f61, #995c00, #0a5f61, transparent)", backgroundSize: "200% 100%", opacity: scrolled ? 1 : 0.3 }} />

        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", py: { xs: 0.8, md: 1 } }}>

            {/* Brand */}
            <Stack direction="row" spacing={1.5} alignItems="center" component={Link} to="/" sx={{ textDecoration: "none" }}>
              <Box component="img" src="/logo.png" alt="Zenox" sx={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(10,95,97,0.4)" }} />
              <Box>
                <Typography fontFamily="'Orbitron', sans-serif" fontWeight={800} color="#4cb4c4" sx={{ fontSize: { xs: 15, md: 17 }, letterSpacing: 3 }}>
                  ZENOX
                </Typography>
                <Typography fontSize={8} color="rgba(255,255,255,0.35)" letterSpacing="0.15em" sx={{ display: { xs: "none", sm: "block" }, mt: -0.3 }}>
                  TASKS & EARN
                </Typography>
              </Box>
            </Stack>

            {/* Desktop Nav */}
            <Stack direction="row" spacing={0.3} alignItems="center" sx={{ display: { xs: "none", lg: "flex" } }}>
              {navLinks.map((link) => (
                <Button key={link.label} component={Link} to={link.to}
                  onMouseEnter={() => setActiveHover(link.label)} onMouseLeave={() => setActiveHover(null)}
                  sx={{
                    color: location.pathname === link.to ? "#4cb4c4" : "rgba(255,255,255,0.65)",
                    px: 2, py: 0.8, borderRadius: 1, fontSize: 13, fontWeight: 600,
                    background: location.pathname === link.to ? "rgba(10,95,97,0.15)" : activeHover === link.label ? "rgba(10,95,97,0.06)" : "transparent",
                    "&:hover": { background: "rgba(10,95,97,0.1)" }, transition: "all 0.25s ease"
                  }}>
                  {link.label}
                </Button>
              ))}

              <Divider orientation="vertical" sx={{ mx: 1.5, height: 20, background: "rgba(255,255,255,0.06)" }} />

              {/* Live stats */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mr: 1.5 }}>
                {stats.map((s) => (
                  <Stack key={s.label} direction="row" alignItems="center" spacing={0.6}>
                    <Box sx={{ color: "#0a5f61", fontSize: 12 }}>{s.icon}</Box>
                    <Box>
                      <Typography fontSize={12} fontWeight={700} color="#e2e8f0" lineHeight={1}>{s.value}</Typography>
                      <Typography fontSize={9} color="#8892a0" lineHeight={1}>{s.label}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            {/* Desktop CTA */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: "none", lg: "flex" } }}>
              <Button component={Link} to="/login"
                sx={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.08)", borderRadius: 1, px: 2.5, py: 0.7, fontSize: 13, textTransform: "none", fontWeight: 600, border: "1px solid", "&:hover": { borderColor: "#4cb4c4", color: "#4cb4c4", background: "rgba(10,95,97,0.08)" }, transition: "all 0.25s ease" }}>
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained"
                endIcon={<FiArrowRight />}
                sx={{
                  background: "linear-gradient(135deg, #073f40, #0a5f61)", color: "#fff",
                  borderRadius: 1, px: 2.5, py: 0.8, fontSize: 13, textTransform: "none", fontWeight: 700,
                  position: "relative", overflow: "hidden",
                  "&::before": { content: '""', position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent)", transform: "translateX(-100%)", transition: "transform 0.5s" },
                  "&:hover::before": { transform: "translateX(100%)" },
                  "&:hover": { boxShadow: "0 8px 30px rgba(7,63,64,0.5)", transform: "translateY(-1px)" },
                  transition: "all 0.3s ease"
                }}>
                Start Earning
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton onClick={() => setDrawerOpen(true)}
              sx={{ display: { lg: "none" }, color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 1, width: 38, height: 38, "&:hover": { background: "rgba(10,95,97,0.1)", borderColor: "#0a5f61" } }}>
              <FiMenu size={20} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { background: "linear-gradient(180deg, #060a14 0%, #0b1120 50%, #0d1525 100%)", borderLeft: "1px solid rgba(10,95,97,0.12)" } }}>
        <Box sx={{ width: 300, height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" p={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box component="img" src="/logo.png" alt="Zenox" sx={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(10,95,97,0.3)" }} />
                <Box>
                  <Typography fontFamily="'Orbitron', sans-serif" fontWeight={800} color="#4cb4c4" sx={{ fontSize: 16, letterSpacing: 2 }}>ZENOX</Typography>
                  <Typography fontSize={8} color="rgba(255,255,255,0.35)" letterSpacing="0.2em">TASKS & EARN</Typography>
                </Box>
            </Stack>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 1 }}>
              <FiX size={20} />
            </IconButton>
          </Stack>
          <Divider sx={{ background: "rgba(255,255,255,0.04)" }} />

          {/* Mobile stats */}
          <Box sx={{ p: 2.5 }}>
            <Box sx={{ p: 2, borderRadius: 2, background: "rgba(10,95,97,0.06)", border: "1px solid rgba(10,95,97,0.12)" }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#00a854", boxShadow: "0 0 8px rgba(0,168,84,0.5)" }} />
                <Typography fontSize={11} fontWeight={700} color="#00a854">LIVE STATS</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                {stats.map((s) => (
                  <Box key={s.label} sx={{ flex: 1 }}>
                    <Typography fontSize={16} fontWeight={800} color="#e2e8f0" lineHeight={1}>{s.value}</Typography>
                    <Typography fontSize={10} color="#8892a0">{s.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ background: "rgba(255,255,255,0.04)" }} />

          {/* Nav links */}
          <List sx={{ px: 2, py: 1.5 }}>
            {navLinks.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton component={Link} to={link.to} onClick={() => setDrawerOpen(false)}
                  sx={{ borderRadius: 1.5, mb: 0.5, py: 1.2, px: 2, background: location.pathname === link.to ? "rgba(10,95,97,0.12)" : "transparent", border: location.pathname === link.to ? "1px solid rgba(10,95,97,0.15)" : "1px solid transparent", "&:hover": { background: "rgba(10,95,97,0.06)" } }}>
                  <ListItemText primary={link.label} sx={{ "& .MuiListItemText-primary": { fontWeight: 600, fontSize: 14 } }} />
                  {location.pathname === link.to && <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#0a5f61", boxShadow: "0 0 6px rgba(10,95,97,0.5)" }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Mobile CTA */}
          <Box sx={{ p: 2.5, mt: "auto" }}>
            <Button component={Link} to="/login" fullWidth
              sx={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.08)", borderRadius: 1.5, py: 1, mb: 1, fontWeight: 600, border: "1px solid", "&:hover": { borderColor: "#4cb4c4", color: "#4cb4c4", background: "rgba(10,95,97,0.08)" } }}>
              Login to Account
            </Button>
            <Button component={Link} to="/register" fullWidth variant="contained"
              endIcon={<FaBolt />}
              sx={{ background: "linear-gradient(135deg, #073f40, #0a5f61)", borderRadius: 1.5, py: 1.2, fontWeight: 700, "&:hover": { boxShadow: "0 8px 30px rgba(7,63,64,0.5)" } }}>
              Create Free Account
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default PublicHeader;
