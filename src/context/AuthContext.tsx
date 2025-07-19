import { getCurrentUser } from "@/lib/appwrite/api";
import { IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      const currentAccount = await getCurrentUser();
      
      if (currentAccount && typeof currentAccount === 'object' && '$id' in currentAccount) {
        setUser({
          id: (currentAccount as any).$id || "",
          name: (currentAccount as any).name || "",
          username: (currentAccount as any).username || "",
          email: (currentAccount as any).email || "",
          imageUrl: (currentAccount as any).imageUrl || "",
          bio: (currentAccount as any).bio || "",
        });
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    const hasValidSession = cookieFallback && cookieFallback !== "[]" && cookieFallback !== "null";
    // List of public auth routes
    const publicRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password", "/verify"];
    // If not logged in and not on a public route, redirect to signin
    if (!hasValidSession && !publicRoutes.includes(location.pathname)) {
      navigate("/signin");
      return;
    }
    checkAuthUser();
  }, [navigate, location.pathname]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
