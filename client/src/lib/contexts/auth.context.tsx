"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService, AuthResponse } from "../services/auth.service";

const ADMIN_ROLE = 5320;

const Cookies = {
  set: (name: string, value: string, options: { path?: string; expires?: number } = {}) => {
    const expires = options.expires
      ? new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000)
      : undefined;

    document.cookie = `${name}=${encodeURIComponent(value)}${options.path ? `;path=${options.path}` : ""}${expires ? `;expires=${expires.toUTCString()}` : ""}`;
  },

  get: (name: string) => {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");

      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }

    return undefined;
  },

  remove: (name: string, options: { path?: string } = {}) => {
    document.cookie = `${name}=;path=${options.path || "/"};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: { roles: number[] } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles?: string[];
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ roles: number[] } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = Cookies.get("accessToken");
      const rolesStr = Cookies.get("userRoles");

      if (token && rolesStr) {
        setIsAuthenticated(true);
        try {
          setUser({ roles: JSON.parse(rolesStr) });
        } catch (e) {
          console.error("Error parsing roles from cookie:", e);
        }
      }
    }
  }, []);

  const isAdmin = () => {
    return user?.roles.includes(ADMIN_ROLE) || false;
  };

  const handleAuthResponse = (response: AuthResponse) => {
    // Set cookies with path and expiration
    Cookies.set("accessToken", response.accessToken, { path: "/", expires: 1 }); // 1 day
    Cookies.set("userRoles", JSON.stringify(response.roles), { path: "/", expires: 1 });

    // Also keep in localStorage for API requests
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("userRoles", JSON.stringify(response.roles));

    setIsAuthenticated(true);
    setUser({ roles: response.roles });

    // Redirect based on role
    const hasAdminRole = response.roles.includes(ADMIN_ROLE);

    if (hasAdminRole) {
      router.push("/admin-panel");
    } else {
      router.push("/");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      handleAuthResponse(response);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles?: string[];
  }) => {
    try {
      const response = await authService.register({
        ...data,
        roles: data.roles || ["ROLE_USER"],
      });

      handleAuthResponse(response);
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
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRoles");

      // Clear cookies
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("userRoles", { path: "/" });

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
        isAdmin,
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
