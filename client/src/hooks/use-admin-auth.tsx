import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";

interface AdminUser {
  id: number;
  username: string;
  name?: string;
  email?: string;
  role: string;
  isActive: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

type AdminAuthContextType = {
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  isAuthenticated: boolean;
};

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if admin is logged in from localStorage
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminUser');
    
    if (token && storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      setAdminUser(data.admin);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      setError(null);
    },
    onError: (error: Error) => {
      setError(error);
      setAdminUser(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      setAdminUser(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setError(null);
    },
    onError: (error: Error) => {
      // Even if logout fails, clear local state
      setAdminUser(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
  });

  const isAuthenticated = !!adminUser;

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}