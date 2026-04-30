import { Box } from "@mui/material";
import { motion } from "framer-motion";

const AnimatedIcon = ({ children, size = 20, color = "inherit", pulse = false, rotate = false }) => (
  <Box
    component={motion.span}
    animate={{
      y: pulse ? [0, -3, 0] : 0,
      rotate: rotate ? [0, 10, -10, 0] : 0,
      filter: ["drop-shadow(0 0 0px rgba(255,255,255,0))", "drop-shadow(0 0 8px rgba(76,180,196,0.35))", "drop-shadow(0 0 0px rgba(255,255,255,0))"],
    }}
    transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
    sx={{ display: "inline-flex", fontSize: size, color, lineHeight: 1 }}
  >
    {children}
  </Box>
);

export default AnimatedIcon;
