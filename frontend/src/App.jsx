import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiHome,
  FiList,
  FiLock,
  FiSettings,
  FiUser,
  FiUsers,
  FiShare2,
} from "react-icons/fi";
import { RiTaskFill, RiWallet3Line } from "react-icons/ri";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/layout/AppShell";
import PublicLayout from "./components/layout/PublicLayout";
import PublicHeader from "./components/layout/PublicHeader";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import WithdrawalsPage from "./pages/admin/WithdrawalsPage";
import ManageTasksPage from "./pages/admin/ManageTasksPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ReviewCompletionsPage from "./pages/admin/ReviewCompletionsPage";
import HistoryPage from "./pages/user/HistoryPage";
import ProfilePage from "./pages/user/ProfilePage";
import SettingsPage from "./pages/user/SettingsPage";
import TaskDetailsPage from "./pages/user/TaskDetailsPage";
import TasksPage from "./pages/user/TasksPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import WalletPage from "./pages/user/WalletPage";
import ReferralPage from "./pages/user/ReferralPage";
import ChangePasswordPage from "./pages/user/ChangePasswordPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import NotFoundPage from "./pages/public/NotFoundPage";

const userItems = [
  { label: "Dashboard", to: "/app/dashboard", icon: <FiHome /> },
  { label: "Tasks", to: "/app/tasks", icon: <FiList /> },
  { label: "History", to: "/app/history", icon: <FiClock /> },
  { label: "Profile", to: "/app/profile", icon: <FiUser /> },
  { label: "Wallet", to: "/app/wallet", icon: <RiWallet3Line /> },
  { label: "Refer & Earn", to: "/app/referral", icon: <FiShare2 /> },
  { label: "Change Password", to: "/app/change-password", icon: <FiLock /> },
  { label: "Privacy & Setting", to: "/app/settings", icon: <FiSettings /> },
];

const adminItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <FiHome /> },
  { label: "Task Reviews", to: "/admin/completions", icon: <FiCheckCircle /> },
  { label: "Withdrawals", to: "/admin/withdrawals", icon: <RiWallet3Line /> },
  { label: "Manage Users", to: "/admin/users", icon: <FiUsers /> },
  { label: "Manage Tasks", to: "/admin/tasks", icon: <RiTaskFill /> },
  { label: "Settings", to: "/admin/settings", icon: <FiSettings /> },
];

const App = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicLayout>
          <HomePage />
        </PublicLayout>
      }
    />
    <Route
      path="/login"
      element={
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      }
    />
    <Route
      path="/register"
      element={
        <PublicLayout>
          <RegisterPage />
        </PublicLayout>
      }
    />
    <Route
      path="/about"
      element={
        <PublicLayout>
          <AboutPage />
        </PublicLayout>
      }
    />
    <Route
      path="/contact"
      element={
        <PublicLayout>
          <ContactPage />
        </PublicLayout>
      }
    />

    <Route
      path="/app/dashboard"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <UserDashboardPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/tasks"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <TasksPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/tasks/:taskId"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <TaskDetailsPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/history"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <HistoryPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/profile"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <ProfilePage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/wallet"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <WalletPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/settings"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <SettingsPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/referral"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <ReferralPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app/change-password"
      element={
        <ProtectedRoute role="USER">
          <AppShell title="Zenox User Panel" items={userItems}>
            <ChangePasswordPage />
          </AppShell>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute role="ADMIN">
          <AppShell title="Zenox Admin Panel" items={adminItems}>
            <AdminDashboardPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/withdrawals"
      element={
        <ProtectedRoute role="ADMIN">
          <AppShell title="Zenox Admin Panel" items={adminItems}>
            <WithdrawalsPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute role="ADMIN">
          <AppShell title="Zenox Admin Panel" items={adminItems}>
            <ManageUsersPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/tasks"
      element={
        <ProtectedRoute role="ADMIN">
          <AppShell title="Zenox Admin Panel" items={adminItems}>
            <ManageTasksPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/completions"
      element={
        <ProtectedRoute role="ADMIN">
          <AppShell title="Zenox Admin Panel" items={adminItems}>
            <ReviewCompletionsPage />
          </AppShell>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings"
      element={
        <ProtectedRoute role="ADMIN">
          <AppShell title="Zenox Admin Panel" items={adminItems}>
            <AdminSettingsPage />
          </AppShell>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
