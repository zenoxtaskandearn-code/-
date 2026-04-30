import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearAuth, getStoredToken, getStoredUser, saveAuth } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data?.data?.user || null);
      } catch (_error) {
        clearAuth();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    const accessToken = data?.data?.accessToken;
    const authUser = data?.data?.user;
    saveAuth({ token: accessToken, user: authUser });
    setToken(accessToken);
    setUser(authUser);
    return authUser;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    const accessToken = data?.data?.accessToken;
    const authUser = data?.data?.user;
    saveAuth({ token: accessToken, user: authUser });
    setToken(accessToken);
    setUser(authUser);
    return authUser;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_error) {
      // no-op
    }
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      setUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
