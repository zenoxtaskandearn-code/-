import { Box, Skeleton } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const ShimmerSkeleton = ({ width = "100%", height = 20, variant = "rectangular", borderRadius = 2, sx = {}, shimmerColor = "rgba(255,255,255,0.08)", shimmerHighlight = "rgba(255,255,255,0.18)" }) => (
  <Box sx={{ width, height, borderRadius, background: shimmerColor, position: "relative", overflow: "hidden", ...sx }}>
    <MotionBox
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `linear-gradient(90deg, transparent 0%, ${shimmerHighlight} 50%, transparent 100%)`,
      }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </Box>
);

const PageSkeleton = ({ lines = 5, cards = 3 }) => (
  <Box>
    {/* Header skeleton */}
    <Box sx={{ mb: 3 }}>
      <ShimmerSkeleton width={120} height={12} borderRadius={6} sx={{ mb: 1 }} />
      <ShimmerSkeleton width="70%" height={28} borderRadius={2} sx={{ mb: 0.5 }} />
      <ShimmerSkeleton width="50%" height={14} borderRadius={2} />
    </Box>

    {/* Stat cards skeleton */}
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2, mb: 3 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <ShimmerSkeleton width="60%" height={12} borderRadius={6} sx={{ mb: 1.5 }} />
          <ShimmerSkeleton width="45%" height={22} borderRadius={2} sx={{ mb: 0.8 }} />
          <ShimmerSkeleton width="40%" height={10} borderRadius={6} />
        </Box>
      ))}
    </Box>

    {/* Content cards skeleton */}
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
      {Array.from({ length: cards }).map((_, i) => (
        <Box key={i} sx={{ p: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <ShimmerSkeleton width={80} height={16} borderRadius={1} sx={{ mb: 1.5 }} />
          <ShimmerSkeleton width="85%" height={18} borderRadius={2} sx={{ mb: 1 }} />
          <ShimmerSkeleton width="100%" height={12} borderRadius={2} sx={{ mb: 1 }} />
          <ShimmerSkeleton width="70%" height={12} borderRadius={2} sx={{ mb: 1.5 }} />
          <ShimmerSkeleton width="100%" height={36} borderRadius={2} />
        </Box>
      ))}
    </Box>
  </Box>
);

const CardSkeleton = () => (
  <Box sx={{ p: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
      <ShimmerSkeleton width={70} height={22} borderRadius={1} />
      <ShimmerSkeleton width={50} height={22} borderRadius={1} />
    </Box>
    <ShimmerSkeleton width="80%" height={18} borderRadius={2} sx={{ mb: 1 }} />
    <ShimmerSkeleton width="100%" height={12} borderRadius={2} sx={{ mb: 1 }} />
    <ShimmerSkeleton width="60%" height={12} borderRadius={2} sx={{ mb: 2 }} />
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <ShimmerSkeleton width={60} height={20} borderRadius={1} />
      <ShimmerSkeleton width={80} height={28} borderRadius={2} />
    </Box>
  </Box>
);

const TableSkeleton = ({ rows = 5 }) => (
  <Box sx={{ borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
    <Box sx={{ p: 2 }}>
      <ShimmerSkeleton width={120} height={18} borderRadius={2} />
    </Box>
    {Array.from({ length: rows }).map((_, i) => (
      <Box key={i} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2, px: 2, py: 1.5 }}>
        <ShimmerSkeleton width="80%" height={14} borderRadius={2} />
        <ShimmerSkeleton width="60%" height={14} borderRadius={2} />
        <ShimmerSkeleton width={50} height={14} borderRadius={1} />
        <ShimmerSkeleton width="70%" height={14} borderRadius={2} />
      </Box>
    ))}
  </Box>
);

const FormSkeleton = () => (
  <Box sx={{ p: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
    <ShimmerSkeleton width={140} height={20} borderRadius={2} sx={{ mb: 2 }} />
    {Array.from({ length: 3 }).map((_, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <ShimmerSkeleton width={80} height={10} borderRadius={6} sx={{ mb: 0.8 }} />
        <ShimmerSkeleton width="100%" height={44} borderRadius={2} />
      </Box>
    ))}
    <ShimmerSkeleton width="100%" height={42} borderRadius={2} />
  </Box>
);

export { ShimmerSkeleton, PageSkeleton, CardSkeleton, TableSkeleton, FormSkeleton };
