import { Card, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion.create(Card);

const StatCard = ({ label, value, hint, icon, color = "#0f8b8d" }) => (
  <MotionCard
    whileHover={{ y: -5, scale: 1.015, boxShadow: `0 8px 32px ${color}35, 0 0 0 1px ${color}25` }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    sx={{
      p: 2,
      borderRadius: 4,
      background: `linear-gradient(145deg, ${color}18, #111827 64%)`,
      backdropFilter: "blur(12px)",
      border: `1px solid ${color}20`,
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={22} color={color}>{icon}</Typography>
    </Stack>
    <Typography className="kpi-number" variant="h4" mb={0.75}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {hint}
    </Typography>
  </MotionCard>
);

export default StatCard;
