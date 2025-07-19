import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./_auth/form/Signin";
import Signup from "./_auth/form/Signup";
import Home from "./_root/pages/Home";
import Authlayout from "./_auth/Authlayout";
import Rootlayout from "./_root/Rootlayout";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Explore from "./_root/pages/Explore";
import Saved from "./_root/pages/Saved";
import AllUsers from "./_root/pages/AllUsers";
import CreatePost from "./_root/pages/CreatePost";
import EditPost from "./_root/pages/EditPost";
import PostDetails from "./_root/pages/PostDetails";
import Profile from "./_root/pages/Profile";
import UpdatePost from "./_root/pages/UpdatePost";
import ConfigError from "./components/shared/ConfigError";
import { appwriteConfig } from "./lib/appwrite/config";
import VerifyEmail from "./_auth/form/VerifyEmail";
import ForgotPassword from "./_auth/form/ForgotPassword";
import ResetPassword from "./_auth/form/ResetPassword";
import { useUserContext } from "@/context/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useUserContext();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return children;
}

export default function App() {
  // Check if Appwrite is properly configured
  const isConfigured = appwriteConfig.projectId && appwriteConfig.databaseId;

  if (!isConfigured) {
    return <ConfigError />;
  }

  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<Authlayout />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<Rootlayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
          <Route path="/all-users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/update-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/update-profile/:id" element={<ProtectedRoute><UpdatePost /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}
