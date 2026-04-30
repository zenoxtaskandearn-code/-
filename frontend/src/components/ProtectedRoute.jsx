import { Box, Stack } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShimmerSkeleton } from "../components/common/SkeletonLoader";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <ShimmerSkeleton width={120} height={12} borderRadius={6} sx={{ mb: 1 }} />
          <ShimmerSkeleton width="60%" height={28} borderRadius={2} sx={{ mb: 0.5 }} />
          <ShimmerSkeleton width="40%" height={14} borderRadius={2} />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <ShimmerSkeleton width="50%" height={12} borderRadius={6} sx={{ mb: 1.5 }} />
              <ShimmerSkeleton width="40%" height={22} borderRadius={2} sx={{ mb: 0.8 }} />
              <ShimmerSkeleton width="35%" height={10} borderRadius={6} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
