import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

import api, { configureApiAuth, publicApi } from "../api/client";

const AuthContext = createContext(null);

const extractErrorMessage = (error, fallback) => {
  if (!error.response) {
    return "Could not reach API server";
  }

  const firstDetail = error.response?.data?.details?.[0]?.message;
  return firstDetail || error.response?.data?.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthFailure = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const response = await publicApi.post("/auth/refresh");
      const payload = response.data?.data;

      if (!payload?.accessToken || !payload?.user) {
        return null;
      }

      setAccessToken(payload.accessToken);
      setUser(payload.user);

      return payload.accessToken;
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    configureApiAuth({
      getToken: () => accessToken,
      onRefresh: refreshSession,
      onUnauthorized: handleAuthFailure,
    });
  }, [accessToken, refreshSession, handleAuthFailure]);

  useEffect(() => {
    const bootstrap = async () => {
      await refreshSession();
      setInitializing(false);
    };

    bootstrap();
  }, [refreshSession]);

  const login = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await publicApi.post("/auth/login", credentials);
      const payload = response.data?.data;
      setUser(payload.user);
      setAccessToken(payload.accessToken);
      toast.success("Logged in successfully");
      return payload.user;
    } catch (error) {
      toast.error(extractErrorMessage(error, "Login failed"));
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (values) => {
    setAuthLoading(true);
    try {
      const response = await publicApi.post("/auth/register", values);
      const payload = response.data?.data;
      setUser(payload.user);
      setAccessToken(payload.accessToken);
      toast.success("Account created successfully");
      return payload.user;
    } catch (error) {
      toast.error(extractErrorMessage(error, "Registration failed"));
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await publicApi.post("/auth/logout");
    } catch (error) {
      // Client state must still be cleared.
    }

    setUser(null);
    setAccessToken(null);
    toast.info("Logged out");
  };

  const fetchProfile = async () => {
    const response = await api.get("/users/me");
    return response.data?.data;
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      initializing,
      authLoading,
      login,
      register,
      logout,
      refreshSession,
      fetchProfile,
    }),
    [user, accessToken, initializing, authLoading, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
