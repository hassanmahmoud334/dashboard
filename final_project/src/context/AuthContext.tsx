import { createContext, useState, useEffect, use } from "react";
import type { ReactNode } from "react";
type User = {
  username: string;
  email: string;
  name: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "myapp_auth";
const USER_KEY = "myapp_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = (username: string, password: string) => {

    if (username === "Hassan" && password === "1234") {
      const userData: User = {
        username: "Hassan",
        email: "hassan@example.com",
        name: "Hassan User"
      };
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    }
    
    if (username === "admin" && password === "password") {
      const userData: User = {
        username: "admin",
        email: "admin@dashboardapp.com",
        name: "Administrator"
      };
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};