import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until /me resolves

  // ─── Auto session restore on mount ────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.getMe();
        // Backend returns: new ApiResponse(200, { user: req.user }, "...")
        // res.data.data is { user: { id, email, username } }
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const register = async (data) => {
    const res = await authApi.register(data);
    setUser(res.data.data.user);
    return res.data;
  };

  const login = async (data) => {
    const res = await authApi.login(data);
    setUser(res.data.data.user);
    return res.data;
  };

  const googleLogin = async (idToken) => {
    const res = await authApi.googleLogin(idToken);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  // Patch user state in-place after profile/password updates (no re-fetch needed)
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );


}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}