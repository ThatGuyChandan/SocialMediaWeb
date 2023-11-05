import React from "react";
import { Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<Authlayout />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<Rootlayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdatePost />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
}
