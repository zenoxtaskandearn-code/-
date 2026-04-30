import { useState } from "react";
import { Box, Button, Card, Container, Grid, Stack, TextField, Typography, Alert, TextareaAutosize } from "@mui/material";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";
import { FaEnvelope, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const contactInfo = [
  { icon: <FaEnvelope />, title: "Email", detail: "support@zenox.in", sub: "We reply within 24 hours", color: "#0f8b8d" },
  { icon: <FiPhone />, title: "Phone", detail: "+91 98XXX XXXXX", sub: "Mon - Sat, 10AM - 7PM IST", color: "#ff9f1c" },
  { icon: <FiMapPin />, title: "Location", detail: "India", sub: "Fully remote team", color: "#a78bfa" },
  { icon: <FiClock />, title: "Support Hours", detail: "24/7 Available", sub: "Live chat & email support", color: "#34d399" },
];

const socials = [
  { icon: <FaTwitter />, label: "Twitter", href: "#", color: "#1DA1F2" },
  { icon: <FaInstagram />, label: "Instagram", href: "#", color: "#E4405F" },
  { icon: <FaLinkedin />, label: "LinkedIn", href: "#", color: "#0A66C2" },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* Hero */}
      <Box sx={{ position: "relative", pt: { xs: "100px", md: "120px" }, pb: { xs: 6, md: 8 }, background: "#0b1120", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(255,159,28,0.1) 0%, transparent 50%)" }} />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 3, px: 2, py: 0.8, borderRadius: 50, background: "rgba(255,159,28,0.1)", border: "1px solid rgba(255,159,28,0.2)" }}>
              <MotionBox animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} sx={{ width: 6, height: 6, borderRadius: "50%", background: "#ff9f1c" }} />
              <Typography fontSize={11} fontWeight={700} color="#ff9f1c" textTransform="uppercase" letterSpacing="0.1em">Get In Touch</Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: 28, sm: 36, md: 48 }, fontWeight: 900, color: "#f9fafb", mb: 2, letterSpacing: "-0.02em" }}>Contact Us</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: { xs: 14, md: 17 }, maxWidth: 550, mx: "auto", lineHeight: 1.7 }}>Have a question, issue, or suggestion? We&apos;d love to hear from you. Reach out and we&apos;ll respond promptly.</Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Box sx={{ py: { xs: 6, md: 10 }, background: "#0d1a2d" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {contactInfo.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={c.title}>
                <MotionCard whileHover={{ y: -4 }} sx={{ p: 3, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", transition: "all 0.3s ease" }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: "50%", background: `${c.color}10`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5, fontSize: 18, color: c.color }}>{c.icon}</Box>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={14} mb={0.5}>{c.title}</Typography>
                  <Typography fontWeight={600} fontSize={14} sx={{ color: c.color }}>{c.detail}</Typography>
                  <Typography fontSize={11} color="text.secondary" mt={0.5}>{c.sub}</Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Form + Socials */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "#0b1120" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <MotionCard sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Typography fontWeight={700} fontSize={20} color="#f9fafb" mb={0.5}>Send Us a Message</Typography>
                  <Typography color="text.secondary" fontSize={13} mb={3}>Fill out the form below and we&apos;ll get back to you within 24 hours.</Typography>

                  {sent && <Alert severity="success" sx={{ mb: 2 }}>Message sent successfully! We&apos;ll respond soon.</Alert>}
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                  <Box component="form" onSubmit={onSubmit}>
                    <Stack spacing={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}><TextField label="Full Name" name="name" value={form.name} onChange={onChange} required fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }, "& input": { color: "#e5e7eb", fontSize: 14 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }, "& input": { color: "#e5e7eb", fontSize: 14 } }} /></Grid>
                      </Grid>
                      <TextField label="Subject" name="subject" value={form.subject} onChange={onChange} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }, "& input": { color: "#e5e7eb", fontSize: 14 } }} />
                      <Box>
                        <TextareaAutosize minRows={5} name="message" value={form.message} onChange={onChange} required placeholder="Write your message here..." style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#e5e7eb", fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
                      </Box>
                      <Button type="submit" variant="contained" disabled={sending} endIcon={sending ? null : <FiSend />} sx={{ background: "linear-gradient(135deg, #0f8b8d, #4cb4c4)", borderRadius: 1.5, py: 1.4, fontSize: 14, fontWeight: 700, alignSelf: "flex-start", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(15,139,141,0.4)" }, transition: "all 0.3s ease" }}>
                        {sending ? "Sending..." : "Send Message"}
                      </Button>
                    </Stack>
                  </Box>
                </MotionCard>
              </motion.div>
            </Grid>

            {/* Social + FAQ */}
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <MotionCard sx={{ p: 3, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", mb: 2 }}>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={16} mb={2}>Follow Us</Typography>
                  <Stack direction="row" spacing={1.5}>
                    {socials.map((s) => (
                      <MotionBox key={s.label} href={s.href} target="_blank" component="a" whileHover={{ y: -3, scale: 1.1 }} sx={{ width: 42, height: 42, borderRadius: 1.5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontSize: 16, textDecoration: "none", transition: "all 0.3s ease", "&:hover": { background: `${s.color}12`, borderColor: `${s.color}25` } }}>
                        {s.icon}
                      </MotionBox>
                    ))}
                  </Stack>
                </MotionCard>

                <MotionCard sx={{ p: 3, borderRadius: 2, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Typography fontWeight={700} color="#f9fafb" fontSize={16} mb={2}>Quick Help</Typography>
                  <Stack spacing={1.5}>
                    {[
                      { q: "How do I withdraw?", a: "Go to Wallet → Withdraw → Enter UPI → Submit" },
                      { q: "Is Zenox free?", a: "Yes! Zero investment needed to start earning." },
                      { q: "Response time?", a: "We typically respond within 2-4 hours." },
                    ].map((item) => (
                      <Box key={item.q} sx={{ p: 2, borderRadius: 1.5, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <Typography fontWeight={600} color="#f9fafb" fontSize={13}>{item.q}</Typography>
                        <Typography color="text.secondary" fontSize={12} mt={0.3}>{item.a}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </MotionCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;
