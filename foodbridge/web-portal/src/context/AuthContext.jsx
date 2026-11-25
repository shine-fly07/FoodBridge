import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SEED_USERS, loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("fb_user");
      if (stored) return JSON.parse(stored);
    } catch (_e) {}
    // Default to initial seed donor
    return SEED_USERS.donor;
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem("fb_user_role") || "donor";
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalOptions, setAuthModalOptions] = useState({});

  const openAuthModal = useCallback((options = {}) => {
    setAuthModalOptions(options);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalOptions({});
  }, []);

  // Synchronize localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("fb_user", JSON.stringify(currentUser));
      localStorage.setItem("fb_user_id", String(currentUser.id));
      localStorage.setItem("fb_user_role", currentUser.role || activeRole);
    } else {
      localStorage.removeItem("fb_user");
      localStorage.removeItem("fb_user_id");
      localStorage.removeItem("fb_user_role");
      localStorage.removeItem("fb_token");
    }
  }, [currentUser, activeRole]);

  // Session expiration listener
  useEffect(() => {
    function handleSessionExpired(event) {
      setCurrentUser(null);
      localStorage.removeItem("fb_token");
      openAuthModal({ message: event.detail?.message || "Your session has expired. Please sign in again." });
    }
    window.addEventListener("foodbridge:session-expired", handleSessionExpired);
    return () => window.removeEventListener("foodbridge:session-expired", handleSessionExpired);
  }, []);

  const switchRole = useCallback((roleKey) => {
    if (currentUser?.role !== roleKey) {
      const roleNames = { donor: "donor", volunteer: "volunteer", ngo: "NGO" };
      setAuthModalOptions({
        message: `Sign in with an account registered as ${roleNames[roleKey] || roleKey} to use this role.`,
        role: roleKey,
        tab: "account",
      });
      setAuthModalOpen(true);
      return;
    }

    setActiveRole(roleKey);
    localStorage.setItem("fb_user_role", roleKey);
  }, [currentUser?.role]);

  async function login(credentials) {
    const res = await apiLoginUser(credentials);
    const user = res.user || res;
    if (res.token) {
      localStorage.setItem("fb_token", res.token);
    }
    setCurrentUser(user);
    if (user.role) {
      setActiveRole(user.role);
    }
    setAuthModalOpen(false);
    return user;
  }

  async function signup(userData) {
    const res = await apiRegisterUser(userData);
    const user = res.user || res;
    if (res.token) {
      localStorage.setItem("fb_token", res.token);
    }
    setCurrentUser(user);
    if (user.role) {
      setActiveRole(user.role);
    }
    setAuthModalOpen(false);
    return user;
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("fb_user");
    localStorage.removeItem("fb_user_id");
    localStorage.removeItem("fb_user_role");
    localStorage.removeItem("fb_token");
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeRole,
        setActiveRole: switchRole,
        authModalOpen,
        authModalOptions,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
