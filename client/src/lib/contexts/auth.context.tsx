"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService, AuthResponse } from "../services/auth.service";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { roles: number[] } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ roles: number[] } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const roles = localStorage.getItem("userRoles");

    if (token && roles) {
      setIsAuthenticated(true);
      setUser({ roles: JSON.parse(roles) });
    }
  }, []);

  const handleAuthResponse = (response: AuthResponse) => {
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("userRoles", JSON.stringify(response.roles));
    setIsAuthenticated(true);
    setUser({ roles: response.roles });
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      handleAuthResponse(response);
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await authService.register({
        ...data,
        roles: ["ROLE_USER"],
      });

      handleAuthResponse(response);
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRoles");
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
      }}
    >
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
