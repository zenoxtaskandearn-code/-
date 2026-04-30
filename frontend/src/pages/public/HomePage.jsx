import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FaAndroid, FaArrowRight, FaChartLine, FaClipboardCheck, FaCoins, FaFire,
  FaGamepad, FaGift, FaHeadphones, FaLock, FaMobileAlt, FaRocket,
  FaShieldAlt, FaTasks, FaThumbsUp, FaUserShield, FaUsers, FaWallet,
  FaBolt, FaStar, FaCheck, FaRegClock, FaChevronRight,
} from "react-icons/fa";
import {
  RiCheckboxCircleFill, RiFlashlightFill, RiGlobalFill,
  RiMoneyDollarCircleLine, RiSurveyLine, RiVerifiedBadgeFill,
  RiVipCrownFill, RiArrowDownSLine,
} from "react-icons/ri";
import { FiClock, FiTarget, FiTrendingUp, FiArrowUpRight } from "react-icons/fi";
import { BsPeopleFill, BsStarFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { Link } from "react-router-dom";
import AnimatedIcon from "../../components/common/AnimatedIcon";

/* ── Image assets ── */
const IMG = {
  dashboard: "/d8a998d1-2134-45d7-a2d2-35acea60037b.png",
  wallet: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=280&fit=crop&q=80",
  phone: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&q=80",
  earning: "https://images.unsplash.com/photo-1579621970563-ebec09e9e470?w=400&h=260&fit=crop&q=80",
  avatar1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&q=80",
  avatar2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&q=80",
  avatar3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&q=80",
  avatar4: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&q=80",
  avatar5: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&q=80",
  avatar6: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face&q=80",
  apk: "https://images.unsplash.com/photo-1551650975-87dc550595e1?w=300&h=200&fit=crop&q=80",
  survey: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop&q=80",
  gaming: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop&q=80",
  social: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop&q=80",
  referral: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop&q=80",
  video: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=200&fit=crop&q=80",
  signup: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=200&fit=crop&q=80",
  order: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&q=80",
  heroBg: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop&q=80",
  ctaBg: "https://images.unsplash.com/photo-1553729459-afe8f2e2ed08?w=1000&h=600&fit=crop&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&q=80",
};

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);
const MotionCard = motion.create(Card);

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 25, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const taskCategories = [
  { title: "APK Installs", desc: "Download & test apps", icon: <FaAndroid />, color: "#34d399", count: "1.2K+", reward: "₹15-40" },
  { title: "Sign Ups", desc: "Register & verify", icon: <RiVerifiedBadgeFill />, color: "#0f8b8d", count: "800+", reward: "₹20-60" },
  { title: "Surveys", desc: "Share your opinion", icon: <RiSurveyLine />, color: "#ff9f1c", count: "600+", reward: "₹10-25" },
  { title: "Orders", desc: "Purchase tasks", icon: <FaGift />, color: "#f472b6", count: "400+", reward: "₹30-80" },
  { title: "Gaming", desc: "Play & earn", icon: <FaGamepad />, color: "#a78bfa", count: "350+", reward: "₹20-100" },
  { title: "Social", desc: "Engage & share", icon: <BsPeopleFill />, color: "#60a5fa", count: "900+", reward: "₹5-15" },
  { title: "Referrals", desc: "Invite & earn", icon: <FaUsers />, color: "#fb923c", count: "200+", reward: "∞" },
  { title: "Videos", desc: "Watch & answer", icon: <FaBolt />, color: "#fbbf24", count: "500+", reward: "₹8-12" },
];

const trendingTasks = [
  { title: "Install Paytm Banking", cat: "APK", reward: "₹25", users: "2.1K", time: "2 min", difficulty: "Easy", color: "#34d399", hot: true },
  { title: "Sign Up on Groww", cat: "Register", reward: "₹40", users: "1.8K", time: "5 min", difficulty: "Medium", color: "#ff9f1c", hot: true },
  { title: "Order via Swiggy", cat: "Order", reward: "₹30", users: "3.4K", time: "10 min", difficulty: "Easy", color: "#f472b6" },
  { title: "Tech Survey", cat: "Survey", reward: "₹15", users: "4.2K", time: "3 min", difficulty: "Easy", color: "#60a5fa" },
  { title: "Ludo King Level 5", cat: "Gaming", reward: "₹20", users: "1.5K", time: "15 min", difficulty: "Hard", color: "#a78bfa" },
  { title: "Refer PhonePe", cat: "Referral", reward: "₹50", users: "900", time: "5 min", difficulty: "Medium", color: "#0f8b8d", hot: true },
];

const features = [
  { title: "Smart Matching", desc: "AI campaigns based on device & location", icon: <FaTasks />, color: "#0f8b8d" },
  { title: "Live Wallet", desc: "Real-time balance with insights", icon: <FaCoins />, color: "#ff9f1c" },
  { title: "Trusted Proof", desc: "UPI screenshots + admin review", icon: <FaShieldAlt />, color: "#4cb4c4" },
  { title: "Referral 10%", desc: "Lifetime commission on friends", icon: <FaUsers />, color: "#a78bfa" },
  { title: "Mobile First", desc: "Touch-optimized responsive UI", icon: <FaMobileAlt />, color: "#f472b6" },
  { title: "Analytics", desc: "Charts, streaks & performance", icon: <FaChartLine />, color: "#34d399" },
];

const howItWorks = [
  { title: "Create Account", desc: "Sign up in 60 seconds", step: "01", icon: <RiFlashlightFill /> },
  { title: "Browse Tasks", desc: "Filter by category & reward", step: "02", icon: <FaTasks /> },
  { title: "Submit Proof", desc: "Upload UPI screenshot", step: "03", icon: <FaClipboardCheck /> },
  { title: "Get Paid", desc: "Instant UPI withdrawal", step: "04", icon: <FaWallet /> },
];

const testimonials = [
  { name: "Rahul S.", role: "Android Earner", text: "Completed 47 APK installs last month. Withdrew ₹3,200. Best platform ever.", avatar: "RS", earning: "₹3,200", rating: 5 },
  { name: "Priya M.", role: "Survey Pro", text: "Wallet tracking is amazing. See every rupee in real time.", avatar: "PM", earning: "₹5,400", rating: 5 },
  { name: "Amit K.", role: "Referral King", text: "Referral program pays me ₹8,000+ monthly passively.", avatar: "AK", earning: "₹8,100", rating: 5 },
  { name: "Sneha R.", role: "Task Expert", text: "Only platform that pays on time. Every single time.", avatar: "SR", earning: "₹2,750", rating: 5 },
  { name: "Vikram P.", role: "Gamer", text: "Gaming tasks are fun. Reached level 10 in 3 days for ₹500.", avatar: "VP", earning: "₹1,800", rating: 4 },
  { name: "Meera D.", role: "Student", text: "Earn ₹500-800 daily between classes. Perfect for students.", avatar: "MD", earning: "₹4,600", rating: 5 },
];

const faqs = [
  { q: "Is Zenox free?", a: "Yes. Zero investment needed. Earn from your first task." },
  { q: "How do I withdraw?", a: "Wallet → Withdraw → Enter UPI ID → Upload proof → Submit. Approved in 24h." },
  { q: "What is UPI proof?", a: "Screenshot of your UPI transaction confirming task completion." },
  { q: "Works on mobile?", a: "Fully optimized for mobile, tablet, and desktop browsers." },
  { q: "Daily task limit?", a: "No limit. Complete as many as available. New tasks hourly." },
  { q: "Is data safe?", a: "256-bit SSL encryption. We never share personal data." },
];

const trustItems = [
  { icon: <FaLock />, label: "256-bit SSL", sub: "Bank-grade encrypt", color: "#0f8b8d" },
  { icon: <RiVerifiedBadgeFill />, label: "Verified Ads", sub: "100% legit campaigns", color: "#ff9f1c" },
  { icon: <FaUserShield />, label: "Anti-Fraud", sub: "AI detection system", color: "#4cb4c4" },
  { icon: <FaHeadphones />, label: "24/7 Support", sub: "Always available", color: "#a78bfa" },
];

const liveWinners = [
  { phone: "+9162*******92", name: "R***", amount: "₹450", task: "APK Installs" },
  { phone: "+9198*******41", name: "P***", amount: "₹320", task: "Sign Up" },
  { phone: "+9176*******15", name: "A***", amount: "₹680", task: "Order Task" },
  { phone: "+9184*******73", name: "S***", amount: "₹210", task: "Survey" },
  { phone: "+9193*******28", name: "V***", amount: "₹540", task: "Referral" },
  { phone: "+9170*******56", name: "M***", amount: "₹390", task: "Gaming" },
  { phone: "+9189*******84", name: "K***", amount: "₹720", task: "APK Installs" },
  { phone: "+9195*******37", name: "D***", amount: "₹280", task: "Social" },
  { phone: "+9178*******62", name: "N***", amount: "₹610", task: "Sign Up" },
  { phone: "+9181*******49", name: "T***", amount: "₹470", task: "Order Task" },
  { phone: "+9196*******21", name: "G***", amount: "₹350", task: "Video Task" },
  { phone: "+9187*******95", name: "I***", amount: "₹890", task: "Referral" },
];

const COLORS = ["#34d399", "#0f8b8d", "#ff9f1c", "#60a5fa", "#a78bfa", "#f472b6", "#fb923c", "#22d3ee"];

/* ── Curve Divider Component ── */
const CurveDivider = ({ fromColor, toColor, flip = false }) => {
  const p1 = flip
    ? "M0,120 C180,30 360,100 540,60 C720,20 900,90 1080,50 C1260,40 1380,70 1440,30 L1440,0 L0,0 Z"
    : "M0,0 C180,100 360,20 540,60 C720,100 900,30 1080,50 C1260,80 1380,10 1440,60 L1440,120 L0,120 Z";
  const p2 = flip
    ? "M0,120 C200,50 400,80 600,40 C800,10 1000,70 1200,50 C1350,45 1420,60 1440,50 L1440,0 L0,0 Z"
    : "M0,0 C200,90 400,30 600,70 C800,100 1000,40 1200,60 C1350,75 1420,30 1440,55 L1440,120 L0,120 Z";
  return (
    <Box sx={{ position: "relative", overflow: "hidden", lineHeight: 0, background: fromColor }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
        <path d={p1} fill={toColor} />
        <path d={p2} fill={toColor} opacity="0.4" />
      </svg>
    </Box>
  );
};

const DeepCurve = ({ fromColor, toColor, flip = false }) => {
  const p1 = flip
    ? "M0,160 C120,40 240,120 400,70 C560,20 720,140 880,60 C1040,10 1200,80 1350,50 1440,40 L1440,0 L0,0 Z"
    : "M0,0 C120,140 240,20 400,90 C560,140 720,30 880,100 C1040,130 1200,20 1350,80 1440,60 L1440,160 L0,160 Z";
  const p2 = flip
    ? "M0,160 C160,60 320,100 480,50 C640,10 800,130 960,70 C1120,30 1280,60 1440,50 L1440,0 L0,0 Z"
    : "M0,0 C160,120 320,40 480,110 C640,150 800,20 960,90 C1120,140 1280,40 1440,70 L1440,160 L0,160 Z";
  const p3 = flip
    ? "M0,160 C200,80 400,110 600,60 C800,20 1000,140 1200,80 C1400,70 1440,65 L1440,0 L0,0 Z"
    : "M0,0 C200,110 400,60 600,100 C800,140 1000,40 1200,60 C1400,50 1440,55 L1440,160 L0,160 Z";
  return (
    <Box sx={{ position: "relative", overflow: "hidden", lineHeight: 0, background: fromColor }}>
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
        <path d={p1} fill={toColor} />
        <path d={p2} fill={toColor} opacity="0.3" />
        <path d={p3} fill={toColor} opacity="0.15" />
      </svg>
    </Box>
  );
};

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [winnerIdx, setWinnerIdx] = useState(0);
  const [winnerSlide, setWinnerSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWinnerSlide(1);
      setTimeout(() => {
        setWinnerIdx((prev) => (prev + 1) % liveWinners.length);
        setWinnerSlide(0);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const currentWinners = [];
  for (let i = 0; i < 5; i++) {
    currentWinners.push(liveWinners[(winnerIdx + i) % liveWinners.length]);
  }

  return (
    <Box sx={{ overflowX: "hidden" }}>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO — Premium 2026 SaaS Style                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", overflow: "hidden", background: "#0b1120" }}>
        {/* Background effects */}
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(15,139,141,0.12) 0%, transparent 50%)" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 80%, rgba(255,159,28,0.06) 0%, transparent 40%)" }} />
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(15,139,141,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,139,141,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at 40% 40%, black 10%, transparent 60%)" }} />
        <MotionBox animate={{ y: [-15, 20, -15], x: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          sx={{ position: "absolute", top: "15%", left: "5%", width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <MotionBox animate={{ y: [10, -15, 10] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          sx={{ position: "absolute", bottom: "20%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,28,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <MotionBox key={i}
            animate={{ y: [0, -20 - Math.random() * 25, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 4 }}
            sx={{ position: "absolute", left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 70}%`, width: 2 + Math.random() * 2, height: 2 + Math.random() * 2, borderRadius: "50%", background: ["#0f8b8d", "#ff9f1c", "#a78bfa", "#34d399"][i % 4], filter: "blur(1px)" }} />
        ))}

        {/* Hero Grid Layout */}
        <Box sx={{
          position: "relative", zIndex: 2,
          width: "100%", maxWidth: 1400, mx: "auto", px: { xs: 3, sm: 5, md: 6, lg: 8 },
          pt: { xs: 12, md: 16 }, pb: { xs: 5, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          gap: { xs: 4, md: 5, lg: 7 },
          minHeight: { xs: "auto", md: "calc(100vh - 90px)" },
        }}>
          {/* ── LEFT: Text + CTA ── */}
          <Box>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 3, px: 2.5, py: 1, borderRadius: 50, background: "rgba(255,159,28,0.08)", border: "1px solid rgba(255,159,28,0.2)" }}>
                <MotionBox animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} sx={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9f1c" }} />
                <Typography fontSize={12} fontWeight={700} color="#ff9f1c">India&apos;s #1 Task Earning Platform</Typography>
                <FaFire style={{ color: "#ff9f1c", fontSize: 12 }} />
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <Typography sx={{ fontSize: { xs: 30, sm: 36, md: 42, lg: 48 }, lineHeight: { xs: 1.15, md: 1.08 }, mb: 2, fontWeight: 900, letterSpacing: "-0.02em" }}>
                <Typography component="span" color="#fff">Tasks That Pay.</Typography>
                <br />
                <Typography component="span" sx={{ color: "#4cb4c4" }}>Earnings That Grow.</Typography>
              </Typography>
            </motion.div>

            {/* Subtext */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.55)", mb: 3.5, fontSize: { xs: 13.5, md: 15.5 }, lineHeight: 1.7, maxWidth: 460 }}>
                Complete APK installs, registrations, surveys &amp; orders. Track wallet in real-time. Withdraw instantly to UPI. Earn ₹500-2000 daily.
              </Typography>
            </motion.div>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3.5}>
                <Button component={Link} to="/register" variant="contained" size="large" endIcon={<FaArrowRight />}
                  sx={{ background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", color: "#fff", px: 4, py: 1.7, fontSize: 15, borderRadius: 1, fontWeight: 700, width: { xs: "100%", sm: "auto" }, position: "relative", overflow: "hidden",
                    "&::before": { content: '""', position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.15), transparent)", transform: "translateX(-100%)", transition: "transform 0.5s" },
                    "&:hover::before": { transform: "translateX(100%)" }, "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(15,139,141,0.4)" }, transition: "all 0.3s ease" }}>
                  Start Earning Free
                </Button>
                <Button component={Link} to="/login" variant="outlined" size="large"
                  sx={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.12)", px: 4, py: 1.7, fontSize: 15, borderRadius: 1, width: { xs: "100%", sm: "auto" }, backdropFilter: "blur(10px)", "&:hover": { borderColor: "#0f8b8d", color: "#4cb4c4", background: "rgba(15,139,141,0.06)", transform: "translateY(-2px)" }, transition: "all 0.3s ease" }}>
                  Login
                </Button>
              </Stack>
            </motion.div>

            {/* Feature badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mb={3}>
                {[
                  { icon: <RiFlashlightFill />, text: "Instant payouts", color: "#ff9f1c" },
                  { icon: <RiVerifiedBadgeFill />, text: "Verified tasks", color: "#4cb4c4" },
                  { icon: <FaFire />, text: "Zero investment", color: "#f472b6" },
                ].map((item) => (
                  <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 0.8, px: 1.5, py: 0.8, borderRadius: 1, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Box sx={{ color: item.color, fontSize: 14 }}>{item.icon}</Box>
                    <Typography fontSize={12} color="rgba(255,255,255,0.5)">{item.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </motion.div>

            {/* Steps mini strip */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Box sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <Stack direction="row" alignItems="center" spacing={0.8} mb={1.2}>
                  <FaBolt style={{ color: "#ff9f1c", fontSize: 11 }} />
                  <Typography fontSize={10} fontWeight={700} color="#ff9f1c" textTransform="uppercase" letterSpacing="0.05em">Start in 60 seconds</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={0.5}>
                  {howItWorks.map((s, i) => (
                    <Stack key={s.step} direction="row" alignItems="center" spacing={0.8}>
                      <Box sx={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 800, flexShrink: 0 }}>{s.step}</Box>
                      <Typography fontSize={11} color="rgba(255,255,255,0.45)">{s.title}</Typography>
                      {i < 3 && <FaChevronRight style={{ color: "rgba(255,255,255,0.08)", fontSize: 8 }} />}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </motion.div>
          </Box>

          {/* ── RIGHT: Hero Image ── */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ position: "relative", width: "100%", maxWidth: 720 }}>
              {/* Glow */}
              <MotionBox animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                sx={{ position: "absolute", width: "85%", height: "85%", top: "8%", left: "8%", borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.12) 0%, rgba(255,159,28,0.04) 40%, transparent 70%)", filter: "blur(50px)" }} />

              {/* Main image */}
              <MotionBox initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: [0, -8, 0] }} transition={{ delay: 0.4, duration: 0.8, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
                sx={{ position: "relative", zIndex: 1, width: "100%" }}>
                <Box component="img" src={IMG.dashboard} alt="Zenox Dashboard"
                  sx={{ width: "100%", height: "auto", display: "block", objectFit: "contain", borderRadius: 3 }} />
              </MotionBox>

              {/* Floating badge — Top earner */}
              <MotionCard initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, y: [0, -5, 0] }} transition={{ delay: 0.8, duration: 0.5, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                sx={{ position: "absolute", top: { xs: "2%", md: "5%" }, right: { xs: "2%", md: 0 }, zIndex: 2, p: { xs: "6px 10px", md: "8px 14px" }, borderRadius: 2, background: "rgba(11,17,32,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(52,211,153,0.15)", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: { xs: 26, md: 30 }, height: { xs: 26, md: 30 }, borderRadius: "50%", background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FaCoins style={{ color: "#34d399", fontSize: { xs: 11, md: 13 } }} />
                  </Box>
                  <Box>
                    <Typography fontSize={9} color="rgba(255,255,255,0.4)">Top Today</Typography>
                    <Typography fontWeight={800} fontSize={{ xs: 13, md: 15 }} color="#34d399" fontFamily="'Space Grotesk', sans-serif">₹4,850</Typography>
                  </Box>
                </Stack>
              </MotionCard>

              {/* Floating badge — Live users */}
              <MotionCard initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, y: [0, 4, 0] }} transition={{ delay: 1, duration: 0.5, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 } }}
                sx={{ position: "absolute", bottom: { xs: "5%", md: "10%" }, left: { xs: "2%", md: 0 }, zIndex: 2, p: { xs: "6px 10px", md: "8px 14px" }, borderRadius: 2, background: "rgba(11,17,32,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(15,139,141,0.15)", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MotionBox animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: "50%", background: "#4cb4c4", flexShrink: 0 }} />
                  <Box>
                    <Typography fontSize={9} color="rgba(255,255,255,0.4)">Live Users</Typography>
                    <Typography fontWeight={700} fontSize={{ xs: 12, md: 14 }} color="#4cb4c4">1,247 online</Typography>
                  </Box>
                </Stack>
              </MotionCard>
            </Box>
          </Box>
        </Box>

        {/* Bottom stats row */}
        <Box sx={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3, md: 4, lg: 6 }, pb: 2 }}>
          <Grid container spacing={2}>
            {[
              { value: "12,400+", label: "Active Earners", icon: <FaRocket />, color: "#4cb4c4", trend: "+12%" },
              { value: "68,000+", label: "Tasks Done", icon: <FaTasks />, color: "#ff9f1c", trend: "+8%" },
              { value: "₹50L+", label: "Total Paid", icon: <RiMoneyDollarCircleLine />, color: "#34d399", trend: "This month" },
              { value: "99.2%", label: "Approval Rate", icon: <RiCheckboxCircleFill />, color: "#a78bfa", trend: "Best" },
            ].map((s, i) => (
              <Grid item xs={6} md={3} key={s.label}>
                <MotionCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ y: -3, boxShadow: `0 8px 30px rgba(0,0,0,0.2)` }}
                  sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                  <Stack direction="row" alignItems="center" spacing={1.2} mb={1}>
                    <Box sx={{ width: 34, height: 34, borderRadius: 1.5, background: `${s.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: s.color }}>{s.icon}</Box>
                    <Chip size="small" label={s.trend} sx={{ background: `${s.color}10`, color: s.color, fontSize: 9, fontWeight: 700, borderRadius: 1, ml: "auto" }} />
                  </Stack>
                  <Typography fontSize={{ xs: 20, md: 22 }} fontWeight={800} color={s.color} lineHeight={1}>{s.value}</Typography>
                  <Typography fontSize={11} color="rgba(255,255,255,0.4)" mt={0.3}>{s.label}</Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Single curve: hero → next section */}
        <DeepCurve fromColor="#0b1120" toColor="#0d1a2d" />
      </Box>

      {/* ═══ LIVE WINNERS ═══ */}
      <Box sx={{ position: "relative", py: { xs: 4, md: 6 }, background: "#0d1a2d", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "radial-gradient(ellipse at center, rgba(52,211,153,0.04) 0%, transparent 70%)" }} />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <MotionCard initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, background: "linear-gradient(135deg, rgba(52,211,153,0.04), rgba(17,24,39,0.85), rgba(15,139,141,0.04))", border: "1px solid rgba(52,211,153,0.12)", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)" }}>
            <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #34d399, #0f8b8d, #ff9f1c, #34d399)", backgroundSize: "300% 100%" }} />

            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MotionBox animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                    sx={{ position: "absolute", width: 12, height: 12, borderRadius: "50%", background: "#34d399" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px rgba(52,211,153,0.6)" }} />
                </Box>
                <Typography fontSize={{ xs: 12, sm: 13 }} fontWeight={800} color="#34d399" textTransform="uppercase" letterSpacing="0.1em">Live Winners</Typography>
                <Chip size="small" label={`${liveWinners.length} online`} sx={{ background: "rgba(52,211,153,0.1)", color: "#34d399", fontSize: 10, fontWeight: 600, borderRadius: 1, height: 20 }} />
              </Stack>
              <MotionBox animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                <Typography fontSize={11} color="text.secondary">Auto-updating every 2s</Typography>
              </MotionBox>
            </Stack>

            <Grid container spacing={1.5}>
              {currentWinners.map((w, i) => (
                <Grid item xs={6} sm={4} md key={w.phone}>
                  <MotionCard
                    animate={{ opacity: winnerSlide === 0 ? 1 : 0.3, y: winnerSlide === 1 ? -3 : 0, scale: winnerSlide === 1 ? 0.97 : 1 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ y: -3, boxShadow: `0 8px 25px ${COLORS[i % COLORS.length]}15` }}
                    sx={{ p: "8px 12px", borderRadius: 2, background: "rgba(17,24,39,0.55)", border: `1px solid ${COLORS[i % COLORS.length]}12`, transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
                    <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                      sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}00, ${COLORS[i % COLORS.length]}50, ${COLORS[i % COLORS.length]}00)`, backgroundSize: "200% 100%" }} />
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <Box sx={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}25, ${COLORS[i % COLORS.length]}05)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Typography fontSize={12} fontWeight={700} color={COLORS[i % COLORS.length]}>{w.name}</Typography>
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography fontSize={13} fontWeight={700} sx={{ color: COLORS[i % COLORS.length] }}>{w.amount}</Typography>
                          <Typography fontSize={10} color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.phone}</Typography>
                        </Stack>
                        <Typography fontSize={11} color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.task}</Typography>
                      </Box>
                    </Stack>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </MotionCard>
        </Container>
      </Box>

      {/* ═══ CURVE: #0d1a2d → #0b1120 ═══ */}
      <CurveDivider fromColor="#0d1a2d" toColor="#0b1120" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CATEGORIES                                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "#0b1120", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: "20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <Box sx={{ position: "absolute", bottom: "10%", right: "-8%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,28,0.05) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <Box sx={{ position: "absolute", top: "30%", right: "15%", width: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(15,139,141,0.1), transparent)", transform: "rotate(-12deg)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #ff9f1c)", borderRadius: 1 }} />
              <HiSparkles style={{ color: "#ff9f1c", fontSize: 20 }} />
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">Earn Through Multiple Channels</Typography>
              <HiSparkles style={{ color: "#ff9f1c", fontSize: 20 }} />
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #ff9f1c, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" mb={6} textAlign="center" fontSize={15}>Diverse task categories matching your skills & device</Typography>
          </motion.div>

          <Grid container spacing={1.5} component={motion.div} variants={stagger} initial="initial" whileInView="whileInView">
            <Grid item xs={12} md={6}>
              <MotionCard variants={staggerItem} whileHover={{ scale: 1.01, boxShadow: "0 20px 60px rgba(15,139,141,0.18)" }}
                sx={{ p: 4, borderRadius: 2, height: "100%", background: "linear-gradient(145deg, rgba(15,139,141,0.1), rgba(17,24,39,0.85))", border: "1px solid rgba(15,139,141,0.18)", position: "relative", overflow: "hidden", transition: "all 0.4s ease" }}>
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.15) 0%, transparent 70%)", filter: "blur(20px)" }} />
                <Box sx={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", filter: "blur(15px)" }} />
                <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0f8b8d, #34d399, #0f8b8d)", backgroundSize: "200% 100%" }} />
                <Box sx={{ width: 64, height: 64, borderRadius: 2, background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", mb: 2.5, boxShadow: "0 8px 25px rgba(15,139,141,0.3)" }}>
                  <FaAndroid />
                </Box>
                <Typography fontWeight={800} color="#f9fafb" fontSize={{ xs: 22, md: 26 }} mb={1}>APK Installs</Typography>
                <Typography color="text.secondary" fontSize={14} mb={2.5} lineHeight={1.6} maxWidth={400}>Download and test new Android apps from top developers. Quick verification, instant credit to your wallet.</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  <Box sx={{ px: 2, py: 1, borderRadius: 1, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                    <Typography fontSize={11} color="text.secondary">Available</Typography><Typography fontWeight={700} color="#34d399" fontSize={16}>1.2K+</Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 1, borderRadius: 1, background: "rgba(255,159,28,0.08)", border: "1px solid rgba(255,159,28,0.15)" }}>
                    <Typography fontSize={11} color="text.secondary">Reward</Typography><Typography fontWeight={700} color="#ff9f1c" fontSize={16}>₹15-40</Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 1, borderRadius: 1, background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.15)" }}>
                    <Typography fontSize={11} color="text.secondary">Time</Typography><Typography fontWeight={700} color="#60a5fa" fontSize={16}>2-5 min</Typography>
                  </Box>
                </Stack>
              </MotionCard>
            </Grid>

            {taskCategories.slice(1).map((cat, i) => (
              <Grid item xs={6} sm={4} md={2} key={cat.title}>
                <MotionCard variants={staggerItem} whileHover={{ y: -5, boxShadow: `0 12px 40px ${cat.color}15` }}
                  sx={{ p: 2, borderRadius: 2, height: "100%", background: "rgba(17,24,39,0.45)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.3s ease", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: -8, right: -8, width: 35, height: 35, borderRadius: "50%", background: `${cat.color}08` }} />
                  <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                    sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cat.color}00, ${cat.color}60, ${cat.color}00)`, backgroundSize: "200% 100%" }} />
                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, background: `${cat.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: cat.color, mb: 1.5 }}>{cat.icon}</Box>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={13} mb={0.3}>{cat.title}</Typography>
                  <Typography color="text.secondary" fontSize={11} mb={1} lineHeight={1.4}>{cat.desc}</Typography>
                  <Typography fontWeight={700} fontSize={14} sx={{ color: "#ff9f1c" }}>{cat.reward}</Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══ CURVE: #0b1120 → #0d1a2d ═══ */}
      <CurveDivider fromColor="#0b1120" toColor="#0d1a2d" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TRENDING                                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "#0d1a2d" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0b1120 0%, rgba(15,139,141,0.04) 40%, rgba(255,159,28,0.02) 60%, #0b1120 100%)" }} />
        <Box sx={{ position: "absolute", top: "10%", right: "5%", width: 120, height: 120, backgroundImage: "radial-gradient(circle, rgba(255,159,28,0.08) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #ff9f1c)", borderRadius: 1 }} />
              <AnimatedIcon pulse size={20} color="#ff9f1c"><FaFire /></AnimatedIcon>
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">Trending Now</Typography>
              <AnimatedIcon pulse size={20} color="#ff9f1c"><FaFire /></AnimatedIcon>
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #ff9f1c, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" mb={6} textAlign="center" fontSize={15}>Highest converting tasks today</Typography>
          </motion.div>

          <Grid container spacing={1.5} component={motion.div} variants={stagger} initial="initial" whileInView="whileInView">
            {trendingTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.title}>
                <MotionCard variants={staggerItem} whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
                  sx={{ borderRadius: 2, background: "rgba(17,24,39,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)", position: "relative" }}>
                  <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    sx={{ height: 3, background: `linear-gradient(90deg, ${task.color}, ${task.color}44, ${task.color})`, backgroundSize: "200% 100%" }} />
                  {task.hot && (
                    <Box sx={{ position: "absolute", top: 14, right: 14, zIndex: 1 }}>
                      <MotionBox animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Chip label="HOT" size="small" sx={{ background: "rgba(239,68,68,0.18)", color: "#ef4444", fontWeight: 700, fontSize: 10, borderRadius: 1 }} />
                      </MotionBox>
                    </Box>
                  )}
                  <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Chip label={task.cat} size="small" sx={{ background: `${task.color}10`, color: task.color, border: `1px solid ${task.color}20`, fontSize: 10, fontWeight: 600, borderRadius: 1 }} />
                      <Typography fontWeight={800} fontSize={22} sx={{ color: "#ff9f1c", fontFamily: "'Space Grotesk', sans-serif" }}>{task.reward}</Typography>
                    </Stack>
                    <Typography fontWeight={700} color="#f9fafb" mb={1.5} fontSize={14} lineHeight={1.3}>{task.title}</Typography>
                    <Divider sx={{ background: "rgba(255,255,255,0.05)", mb: 1.2 }} />
                    <Stack direction="row" justifyContent="space-between" fontSize={11} color="text.secondary" mb={1.5}>
                      <Stack direction="row" alignItems="center" spacing={0.5}><BsPeopleFill style={{ fontSize: 10, color: task.color }} /><Typography>{task.users} earners</Typography></Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}><FiClock style={{ fontSize: 10 }} /><Typography>{task.time}</Typography></Stack>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip size="small" label={task.difficulty} sx={{ background: task.difficulty === "Easy" ? "rgba(52,211,153,0.1)" : task.difficulty === "Medium" ? "rgba(255,159,28,0.1)" : "rgba(239,68,68,0.1)", color: task.difficulty === "Easy" ? "#34d399" : task.difficulty === "Medium" ? "#ff9f1c" : "#ef4444", fontSize: 10, fontWeight: 700, borderRadius: 1 }} />
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", background: `${task.color}10`, display: "flex", alignItems: "center", justifyContent: "center", color: task.color, cursor: "pointer", transition: "all 0.3s ease", "&:hover": { background: `${task.color}20`, transform: "translateX(3px)" } }}><FiArrowUpRight /></Box>
                    </Stack>
                  </Box>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={5}>
            <Button component={Link} to="/register" variant="outlined" endIcon={<FaArrowRight />} sx={{ color: "#0f8b8d", borderColor: "rgba(15,139,141,0.3)", px: 4, py: 1.2, borderRadius: 1, "&:hover": { borderColor: "#0f8b8d", background: "rgba(15,139,141,0.06)" } }}>View All Tasks</Button>
          </Box>
        </Container>
      </Box>

      {/* ═══ CURVE: #0d1a2d → #0b1120 ═══ */}
      <CurveDivider fromColor="#0d1a2d" toColor="#0b1120" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FEATURES                                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "#0b1120", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: "5%", left: "-8%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <Box sx={{ position: "absolute", bottom: "5%", right: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,28,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <Box sx={{ position: "absolute", top: "15%", right: "8%", width: 80, height: 80, border: "1px solid rgba(15,139,141,0.06)", borderRadius: 2, transform: "rotate(45deg)" }} />
        <Box sx={{ position: "absolute", bottom: "20%", left: "5%", width: 50, height: 50, border: "1px solid rgba(255,159,28,0.06)", borderRadius: 2, transform: "rotate(30deg)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #0f8b8d)", borderRadius: 1 }} />
              <FaBolt style={{ color: "#0f8b8d", fontSize: 20 }} />
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">Why Choose Zenox</Typography>
              <FaBolt style={{ color: "#0f8b8d", fontSize: 20 }} />
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #0f8b8d, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" mb={6} textAlign="center" fontSize={15}>Premium features for serious earners</Typography>
          </motion.div>

          <Grid container spacing={1.5} component={motion.div} variants={stagger} initial="initial" whileInView="whileInView">
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <MotionCard variants={staggerItem} whileHover={{ y: -6, boxShadow: `0 16px 50px ${f.color}12` }}
                  sx={{ p: 3, borderRadius: 2, background: i % 3 === 0 ? `linear-gradient(145deg, ${f.color}06, rgba(17,24,39,0.75))` : "rgba(17,24,39,0.4)", border: `1px solid ${f.color}12`, backdropFilter: "blur(20px)", transition: "all 0.4s ease", position: "relative", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, background: `radial-gradient(circle at top right, ${f.color}06, transparent)`, pointerEvents: "none" }} />
                  <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 50, height: 50, background: `radial-gradient(circle at bottom left, ${f.color}04, transparent)`, pointerEvents: "none" }} />
                  <Box sx={{ position: "absolute", top: 0, left: 0, width: 40, height: 2, background: f.color, borderRadius: "0 0 2px 0" }} />
                  <Box sx={{ width: 48, height: 48, borderRadius: 1.5, background: `${f.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: f.color, mb: 2, border: `1px solid ${f.color}15` }}>{f.icon}</Box>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={16} mb={0.6}>{f.title}</Typography>
                  <Typography color="text.secondary" fontSize={13} lineHeight={1.6}>{f.desc}</Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══ CURVE: #0b1120 → #0d1a2d ═══ */}
      <CurveDivider fromColor="#0b1120" toColor="#0d1a2d" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "#0d1a2d" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0d1a2d 0%, rgba(15,139,141,0.03) 50%, #0d1a2d 100%)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #0f8b8d)", borderRadius: 1 }} />
              <RiFlashlightFill style={{ color: "#0f8b8d", fontSize: 20 }} />
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">Start in 4 Steps</Typography>
              <RiFlashlightFill style={{ color: "#0f8b8d", fontSize: 20 }} />
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #0f8b8d, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" mb={8} textAlign="center" fontSize={15}>No investment. No hidden fees. Just earn.</Typography>
          </motion.div>

          <Grid container spacing={3} component={motion.div} variants={stagger} initial="initial" whileInView="whileInView">
            {howItWorks.map((item, i) => (
              <Grid item xs={6} md={3} key={item.title}>
                <MotionCard variants={staggerItem} whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(15,139,141,0.12)" }}
                  sx={{ p: 3, borderRadius: 2, background: "rgba(17,24,39,0.45)", border: "1px solid rgba(15,139,141,0.1)", transition: "all 0.3s ease", position: "relative", textAlign: "center", overflow: "hidden" }}>
                  <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #0f8b8d, #4cb4c4, #0f8b8d)", backgroundSize: "200% 100%" }} />
                  <Box sx={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, fontSize: 22, color: "#fff", fontWeight: 800, boxShadow: "0 8px 25px rgba(15,139,141,0.3)" }}>{item.step}</Box>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, background: "rgba(15,139,141,0.08)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5, fontSize: 18, color: "#0f8b8d" }}>{item.icon}</Box>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={15} mb={0.5}>{item.title}</Typography>
                  <Typography color="text.secondary" fontSize={12} lineHeight={1.5}>{item.desc}</Typography>
                  {i < 3 && (<Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", width: 40, height: 2, background: "linear-gradient(90deg, rgba(15,139,141,0.3), rgba(15,139,141,0.05))" }} />)}
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══ DEEP CURVE: #0d1a2d → #0b1120 ═══ */}
      <DeepCurve fromColor="#0d1a2d" toColor="#0b1120" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EARNING STATS                                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "#0b1120", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <Box sx={{ position: "absolute", top: "10%", right: "5%", width: 60, height: 60, border: "1px solid rgba(255,159,28,0.06)", borderRadius: 2, transform: "rotate(45deg)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={5}>
              <motion.div {...fadeInUp}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Box sx={{ width: 30, height: 2, background: "#ff9f1c", borderRadius: 1 }} />
                  <Typography fontSize={11} fontWeight={700} color="#ff9f1c" textTransform="uppercase" letterSpacing="0.08em">Earnings Data</Typography>
                </Stack>
                <Typography fontSize={{ xs: 26, md: 34 }} fontWeight={800} color="#f9fafb" mb={1.5} letterSpacing="-0.01em">Weekly Earnings</Typography>
                <Typography color="text.secondary" fontSize={14} lineHeight={1.7} mb={4}>Based on data from top 1,000 earners. Real numbers, real payouts.</Typography>

                <Stack spacing={1.5} mb={4}>
                  {[
                    { label: "Available Tasks", value: "4,250+", color: "#0f8b8d", icon: <FaTasks /> },
                    { label: "Avg Daily", value: "₹350-800", color: "#ff9f1c", icon: <RiMoneyDollarCircleLine /> },
                    { label: "Top Earner", value: "₹45,000+", color: "#34d399", icon: <RiVipCrownFill /> },
                  ].map((item) => (
                    <MotionCard key={item.label} whileHover={{ x: 4, boxShadow: `0 8px 30px ${item.color}10` }}
                      sx={{ p: 2, borderRadius: 2, background: "rgba(17,24,39,0.35)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
                      <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: item.color, borderRadius: "2px 0 0 2px" }} />
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 36, height: 36, borderRadius: 1, background: `${item.color}10`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, fontSize: 16 }}>{item.icon}</Box>
                        <Typography fontSize={13} color="text.secondary">{item.label}</Typography>
                      </Stack>
                      <Typography fontWeight={800} fontSize={18} sx={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</Typography>
                    </MotionCard>
                  ))}
                </Stack>

                <Button component={Link} to="/register" variant="contained" endIcon={<RiVipCrownFill />} sx={{ background: "linear-gradient(135deg, #ff9f1c, #f472b6)", px: 4, py: 1.2, fontSize: 14, fontWeight: 700, borderRadius: 1, "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(255,159,28,0.35)" }, transition: "all 0.3s ease" }}>Start Earning</Button>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={7}>
              <MotionPaper initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 2, background: "rgba(17,24,39,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.08), transparent)", filter: "blur(20px)" }} />
                <Stack direction="row" alignItems="center" spacing={1} mb={3}><FaChartLine style={{ color: "#0f8b8d", fontSize: 18 }} /><Typography fontWeight={700} color="#f9fafb" fontSize={15}>Category Performance</Typography></Stack>
                <Stack spacing={2.5}>
                  {[
                    { label: "APK Installs", value: 72, color: "#34d399" },
                    { label: "Sign Ups", value: 58, color: "#0f8b8d" },
                    { label: "Surveys", value: 45, color: "#ff9f1c" },
                    { label: "Orders", value: 35, color: "#f472b6" },
                    { label: "Gaming", value: 28, color: "#a78bfa" },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Stack direction="row" justifyContent="space-between" mb={0.8}><Typography fontSize={13} color="#e5e7eb">{item.label}</Typography><Typography fontSize={13} color={item.color} fontWeight={700}>{item.value}%</Typography></Stack>
                      <Box sx={{ position: "relative", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                        <MotionBox initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} sx={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${item.color}, ${item.color}66)` }} />
                        <MotionBox initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} sx={{ position: "absolute", right: 0, top: "-4px", width: 16, height: 16, borderRadius: "50%", background: item.color, filter: "blur(4px)", opacity: 0.5 }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, overflow: "hidden", position: "relative" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0b1120, rgba(15,139,141,0.02), #0b1120)" }} />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mb: 6 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #ff9f1c)", borderRadius: 1 }} />
              <BsStarFill style={{ color: "#ff9f1c", fontSize: 18 }} />
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">What Earners Say</Typography>
              <BsStarFill style={{ color: "#ff9f1c", fontSize: 18 }} />
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #ff9f1c, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" textAlign="center" fontSize={15}>12,000+ active earners trust Zenox</Typography>
          </motion.div>
        </Container>

        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(90deg, #0b1120, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(270deg, #0b1120, transparent)", zIndex: 2, pointerEvents: "none" }} />

          {/* Row 1 */}
          <Box sx={{ overflow: "hidden", mb: 2 }}>
            <MotionBox animate={{ x: [0, -1800] }} transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" } }} sx={{ display: "flex", gap: 2, px: 2 }}>
              {[...testimonials, ...testimonials].map((t, i) => (
                <Card key={i} sx={{ p: 2.5, borderRadius: 2, width: 320, flexShrink: 0, background: "rgba(17,24,39,0.55)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #ff9f1c, #0f8b8d, #ff9f1c)", backgroundSize: "200% 100%" }} />
                  <Stack direction="row" spacing={0.3} mb={1}>{Array.from({ length: t.rating }).map((_, si) => <BsStarFill key={si} style={{ color: "#ff9f1c", fontSize: 12 }} />)}</Stack>
                  <Typography color="text.secondary" fontSize={13} lineHeight={1.6} mb={1.5} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>&ldquo;{t.text}&rdquo;</Typography>
                  <Divider sx={{ background: "rgba(255,255,255,0.04)", mb: 1.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>{t.avatar}</Box>
                      <Box><Typography fontWeight={600} color="#f9fafb" fontSize={12}>{t.name}</Typography><Typography color="#0f8b8d" fontSize={10}>{t.role}</Typography></Box>
                    </Stack>
                    <Typography fontSize={15} fontWeight={700} sx={{ color: "#34d399", fontFamily: "'Space Grotesk', sans-serif" }}>{t.earning}</Typography>
                  </Stack>
                </Card>
              ))}
            </MotionBox>
          </Box>

          {/* Row 2 */}
          <Box sx={{ overflow: "hidden" }}>
            <MotionBox animate={{ x: [-1800, 0] }} transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }} sx={{ display: "flex", gap: 2, px: 2 }}>
              {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((t, i) => (
                <Card key={`r-${i}`} sx={{ p: 2.5, borderRadius: 2, width: 320, flexShrink: 0, background: "rgba(17,24,39,0.55)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #0f8b8d, #ff9f1c, #0f8b8d)", backgroundSize: "200% 100%" }} />
                  <Stack direction="row" spacing={0.3} mb={1}>{Array.from({ length: t.rating }).map((_, si) => <BsStarFill key={si} style={{ color: "#ff9f1c", fontSize: 12 }} />)}</Stack>
                  <Typography color="text.secondary" fontSize={13} lineHeight={1.6} mb={1.5} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>&ldquo;{t.text}&rdquo;</Typography>
                  <Divider sx={{ background: "rgba(255,255,255,0.04)", mb: 1.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #ff9f1c, #f472b6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>{t.avatar}</Box>
                      <Box><Typography fontWeight={600} color="#f9fafb" fontSize={12}>{t.name}</Typography><Typography color="#ff9f1c" fontSize={10}>{t.role}</Typography></Box>
                    </Stack>
                    <Typography fontSize={15} fontWeight={700} sx={{ color: "#34d399", fontFamily: "'Space Grotesk', sans-serif" }}>{t.earning}</Typography>
                  </Stack>
                </Card>
              ))}
            </MotionBox>
          </Box>
        </Box>
      </Box>

      {/* ═══ CURVE: #0b1120 → #0d1a2d ═══ */}
      <CurveDivider fromColor="#0b1120" toColor="#0d1a2d" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TRUST                                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "#0d1a2d", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 250, background: "radial-gradient(ellipse at bottom, rgba(15,139,141,0.05) 0%, transparent 70%)" }} />
        <Box sx={{ position: "absolute", top: "10%", left: "8%", width: 70, height: 70, border: "1px solid rgba(15,139,141,0.06)", borderRadius: "50%" }} />
        <Box sx={{ position: "absolute", bottom: "15%", right: "10%", width: 50, height: 50, border: "1px solid rgba(255,159,28,0.06)", borderRadius: "50%" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #4cb4c4)", borderRadius: 1 }} />
              <FaShieldAlt style={{ color: "#4cb4c4", fontSize: 18 }} />
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">Trust & Security</Typography>
              <FaShieldAlt style={{ color: "#4cb4c4", fontSize: 18 }} />
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #4cb4c4, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" mb={6} textAlign="center" fontSize={15}>Your data and earnings are protected</Typography>
          </motion.div>

          <Grid container spacing={2} component={motion.div} variants={stagger} initial="initial" whileInView="whileInView">
            {trustItems.map((item) => (
              <Grid item xs={6} md={3} key={item.label}>
                <MotionPaper variants={staggerItem} whileHover={{ y: -6, boxShadow: `0 16px 50px ${item.color}12` }}
                  sx={{ p: 3, borderRadius: 2, textAlign: "center", background: "rgba(17,24,39,0.35)", backdropFilter: "blur(20px)", border: `1px solid ${item.color}10`, transition: "all 0.4s ease", position: "relative", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }} />
                  <Box sx={{ width: 56, height: 56, borderRadius: 2, background: `${item.color}06`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, fontSize: 24, color: item.color, border: `1px solid ${item.color}12` }}>{item.icon}</Box>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={15} mb={0.3}>{item.label}</Typography>
                  <Typography color="text.secondary" fontSize={12}>{item.sub}</Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══ CURVE: #0d1a2d → #0b1120 ═══ */}
      <CurveDivider fromColor="#0d1a2d" toColor="#0b1120" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FAQ                                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: "relative", background: "#0b1120" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0b1120, rgba(15,139,141,0.02), #0b1120)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div {...fadeInUp}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1} justifyContent="center">
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #a78bfa)", borderRadius: 1 }} />
              <FiTarget style={{ color: "#a78bfa", fontSize: 18 }} />
              <Typography fontSize={{ xs: 26, md: 38 }} fontWeight={800} color="#f9fafb" letterSpacing="-0.01em">FAQ</Typography>
              <FiTarget style={{ color: "#a78bfa", fontSize: 18 }} />
              <Box sx={{ width: 40, height: 2, background: "linear-gradient(90deg, #a78bfa, transparent)", borderRadius: 1 }} />
            </Stack>
            <Typography color="text.secondary" mb={6} textAlign="center" fontSize={15}>Everything you need to know</Typography>
          </motion.div>

          <Box sx={{ maxWidth: 700, mx: "auto" }}>
            {faqs.map((faq, i) => (
              <MotionPaper key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                sx={{ mb: 1, borderRadius: 2, background: "rgba(17,24,39,0.25)", border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${["#0f8b8d", "#ff9f1c", "#a78bfa", "#34d399", "#f472b6", "#60a5fa"][i]}40, transparent)`, borderRadius: 2 }} />
                <Accordion disableGutters sx={{ background: "transparent", boxShadow: "none", "&:before": { display: "none" }, pl: 1.5 }}>
                  <AccordionSummary sx={{ px: 2.5, minHeight: 52, "& .MuiAccordionSummary-content": { my: 1 } }}><Typography fontWeight={600} color="#e5e7eb" fontSize={14}>{faq.q}</Typography></AccordionSummary>
                  <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2 }}><Typography color="text.secondary" fontSize={13} lineHeight={1.7}>{faq.a}</Typography></AccordionDetails>
                </Accordion>
              </MotionPaper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══ DEEP CURVE: #0b1120 → #0d1a2d ═══ */}
      <DeepCurve fromColor="#0b1120" toColor="#0d1a2d" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CTA                                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2, background: "#0d1a2d", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: "5%", left: "5%", width: 100, height: 100, border: "1px solid rgba(15,139,141,0.06)", borderRadius: 2, transform: "rotate(45deg)" }} />
        <Box sx={{ position: "absolute", bottom: "10%", right: "8%", width: 80, height: 80, border: "1px solid rgba(255,159,28,0.06)", borderRadius: "50%" }} />
        <Box sx={{ position: "absolute", top: "20%", right: "15%", width: 40, height: 40, border: "1px solid rgba(167,139,250,0.06)", borderRadius: 1, transform: "rotate(30deg)" }} />
        <MotionBox animate={{ y: [-15, 15, -15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          sx={{ position: "absolute", bottom: "30%", left: "10%", width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.08), transparent)", filter: "blur(20px)" }} />
        <MotionBox animate={{ y: [15, -15, 15] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          sx={{ position: "absolute", top: "40%", right: "5%", width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,28,0.06), transparent)", filter: "blur(15px)" }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <MotionPaper initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            sx={{ p: { xs: 4, md: 6, lg: 8 }, borderRadius: 2, textAlign: "center", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(15,139,141,0.08), rgba(17,24,39,0.95), rgba(255,159,28,0.04))", border: "1px solid rgba(15,139,141,0.12)" }}>
            <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0f8b8d, #ff9f1c, #a78bfa, #0f8b8d)", backgroundSize: "300% 100%" }} />
            <MotionBox animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #a78bfa, #0f8b8d, #ff9f1c, #a78bfa)", backgroundSize: "300% 100%" }} />

            <MotionBox animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              sx={{ position: "absolute", top: "15%", left: "8%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,139,141,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <MotionBox animate={{ x: [50, -50, 50], y: [30, -30, 30] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              sx={{ position: "absolute", bottom: "5%", right: "12%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,28,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <MotionBox animate={{ y: [-20, 20, -20], x: [15, -15, 15] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
              sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />

            <Box sx={{ position: "relative", zIndex: 2 }}>
              <AnimatedIcon pulse size={36} color="#ff9f1c"><RiVipCrownFill /></AnimatedIcon>
              <Typography fontWeight={900} color="#f9fafb" mb={2} fontSize={{ xs: 28, sm: 36, md: 44 }} letterSpacing="-0.02em">Ready to Earn?</Typography>
              <Typography color="rgba(255,255,255,0.6)" mb={5} fontSize={16} maxWidth="480px" mx="auto" lineHeight={1.7}>Join 12,000+ earners. Zero investment. Free account in 60 seconds.</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" mb={5}>
                <Button component={Link} to="/register" variant="contained" size="large" endIcon={<FaArrowRight />}
                  sx={{ background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", color: "#fff", px: 5, py: 1.8, fontSize: 16, borderRadius: 1, fontWeight: 700, "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(15,139,141,0.4)" }, transition: "all 0.3s ease" }}>Create Free Account</Button>
                <Button component={Link} to="/login" variant="outlined" size="large"
                  sx={{ color: "#e5e7eb", borderColor: "rgba(255,255,255,0.2)", px: 5, py: 1.8, fontSize: 16, borderRadius: 1, "&:hover": { borderColor: "#0f8b8d", background: "rgba(15,139,141,0.06)" }, transition: "all 0.3s ease" }}>Login</Button>
              </Stack>

              <Stack direction="row" justifyContent="center" spacing={3} flexWrap="wrap">
                {[
                  { icon: <FaThumbsUp />, text: "No investment", color: "#34d399" },
                  { icon: <FiTrendingUp />, text: "Earn day one", color: "#0f8b8d" },
                  { icon: <FiTarget />, text: "New tasks hourly", color: "#ff9f1c" },
                  { icon: <FaUsers />, text: "12K+ earners", color: "#a78bfa" },
                ].map((item) => (
                  <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Box sx={{ color: item.color, fontSize: 16 }}>{item.icon}</Box>
                    <Typography color="rgba(255,255,255,0.5)" fontSize={13}>{item.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </MotionPaper>
        </Container>
      </Box>

      {/* ═══ CURVE: #0d1a2d → #0b1120 ═══ */}
      <CurveDivider fromColor="#0d1a2d" toColor="#0b1120" />

      {/* ═══ BACK TO TOP BUTTON ═══ */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: { xs: 20, sm: 32 },
          right: { xs: 16, sm: 32 },
          zIndex: 9999,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(15,139,141,0.4)",
          border: "1px solid rgba(76,180,196,0.3)",
          color: "#fff",
          fontSize: 20,
          pointerEvents: showBackToTop ? "auto" : "none",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 30px rgba(15,139,141,0.5)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <RiArrowDownSLine style={{ transform: "rotate(180deg)" }} />
      </MotionBox>
    </Box>
  );
};

export default HomePage;
