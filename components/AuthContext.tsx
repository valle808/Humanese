"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserType {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  reputation?: {
    score: number;
    badges: string; // JSON string of array
  };
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error("Failed to fetch session", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (credentials: any) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Error al iniciar sesión" };
    } catch (e) {
      return { success: false, error: "Error de red al conectar con el servidor" };
    }
  };

  const register = async (regData: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Auto login on successful register
        return login({ email: regData.email, password: regData.password });
      }
      return { success: false, error: data.error || "Error en el registro" };
    } catch (e) {
      return { success: false, error: "Error de red al registrar usuario" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
