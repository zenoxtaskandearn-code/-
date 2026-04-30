import { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { FiBell, FiLogOut, FiMenu, FiSearch, FiZap } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AnimatedIcon from "../common/AnimatedIcon";

const drawerWidth = 280;

const MotionSpan = motion.span;

const navButtonStyles = {
  borderRadius: 3,
  mb: 0.75,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    width: 3,
    height: "100%",
    borderRadius: "0 3px 3px 0",
    background: "linear-gradient(180deg, #0a5f61, #4cb4c4)",
    opacity: 0,
    transition: "opacity 0.2s",
  },
  "&.active": {
    background: "linear-gradient(110deg, rgba(10,95,97,0.25), rgba(76,180,196,0.08))",
    color: "#4cb4c4",
    "&::before": { opacity: 1 },
  },
  transition: "all 0.2s ease",
};

const AppShell = ({ title, items, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const initials = useMemo(() => {
    if (!user?.name) return "ZN";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const drawerContent = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      sx={{
        background: "linear-gradient(180deg, #0b1120 0%, #0f1729 100%)",
      }}
    >
      <Box p={2} pb={1}>
        <Stack direction="row" spacing={1.4} alignItems="center" p={1}>
          <Box
            component="img"
            src="/logo.png"
            alt="Zenox"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(10,95,97,0.4)",
              boxShadow: "0 0 12px rgba(10,95,97,0.3)",
            }}
          />
          <Box>
            <Typography
              fontSize={16}
              fontWeight={800}
              fontFamily="Poppins"
              sx={{
                background: "linear-gradient(135deg, #4cb4c4, #0a5f61)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1.5,
              }}
            >
              ZENOX
            </Typography>
            <Typography fontWeight={500} fontFamily="Poppins" color="#64748b" fontSize={11} letterSpacing={0.5}>
              TASKS & EARN
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
      </Box>

      <List sx={{ mt: 1, flex: 1, px: 1.5 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.label}
            component={NavLink}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            sx={{
              ...navButtonStyles,
              color: "#94a3b8",
              px: 1.5,
              py: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box px={2} pb={2}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(10,95,97,0.15), rgba(76,180,196,0.05))",
            border: "1px solid rgba(10,95,97,0.2)",
            mb: 1.5,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <FiZap color="#4cb4c4" />
            <Typography variant="body2" color="#4cb4c4" fontWeight={600} fontSize={12}>
              Premium Active
            </Typography>
          </Stack>
          <Typography variant="caption" color="#64748b" fontSize={11}>
            All features unlocked
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<FiLogOut />}
          onClick={handleLogout}
          sx={{
            background: "linear-gradient(135deg, #995c00, #cc7a00)",
            borderRadius: 2.5,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 4px 16px rgba(153,92,0,0.25)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(153,92,0,0.35)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#060a14" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backdropFilter: "blur(20px)",
          background: "linear-gradient(180deg, rgba(11,17,32,0.97) 0%, rgba(13,21,37,0.95) 100%)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.4), 0 1px 0 rgba(10,95,97,0.15)",
          borderBottom: "1px solid rgba(10,95,97,0.12)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{
              mr: 2,
              display: { md: "none" },
              background: "rgba(10,95,97,0.1)",
              border: "1px solid rgba(10,95,97,0.2)",
              borderRadius: 2,
              "&:hover": { background: "rgba(10,95,97,0.2)" },
            }}
          >
            <FiMenu />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1.5} flex={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {title.split(" ").map((word, i) => (
                <Typography
                  key={i}
                  variant="h6"
                  fontFamily="Poppins"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.15rem" },
                    background: i === 0 ? "linear-gradient(135deg, #e2e8f0, #94a3b8)" : "linear-gradient(135deg, #4cb4c4, #0a5f61)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {word}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 0.4,
                ml: 2,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <FiSearch color="#64748b" size={14} />
              <Typography color="#64748b" fontSize={12} fontFamily="monospace">
                {location.pathname}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              sx={{
                background: "rgba(153,92,0,0.1)",
                border: "1px solid rgba(153,92,0,0.15)",
                borderRadius: 2,
                p: 1,
                "&:hover": { background: "rgba(153,92,0,0.2)" },
              }}
            >
              <Badge badgeContent={0} color="error" size="small">
                <FiBell color="#995c00" size={18} />
              </Badge>
            </IconButton>

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.6,
                borderRadius: 2.5,
                background: "linear-gradient(135deg, rgba(10,95,97,0.15), rgba(76,180,196,0.05))",
                border: "1px solid rgba(10,95,97,0.2)",
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "transparent",
                  background: "linear-gradient(135deg, #0a5f61, #4cb4c4)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  boxShadow: "0 0 10px rgba(10,95,97,0.3)",
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="Poppins"
                  color="#e2e8f0"
                  lineHeight={1.1}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  fontSize={10}
                  fontWeight={500}
                  color="#64748b"
                  fontFamily="Poppins"
                  lineHeight={1.1}
                >
                  {user?.role || "USER"}
                </Typography>
              </Box>
            </Box>

            <Avatar
              sx={{
                display: { sm: "none" },
                width: 36,
                height: 36,
                bgcolor: "transparent",
                background: "linear-gradient(135deg, #0a5f61, #4cb4c4)",
                fontSize: "0.85rem",
                fontWeight: 700,
                boxShadow: "0 0 12px rgba(10,95,97,0.3)",
              }}
            >
              {initials}
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              background: "#0b1120",
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              background: "#0b1120",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, sm: 2.5, md: 3 },
          mt: 9,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #060a14 0%, #0b1120 100%)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppShell;
