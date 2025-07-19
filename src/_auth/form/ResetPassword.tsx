import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite/config";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Just to check if params exist
    const params = new URLSearchParams(window.location.search);
    if (!params.get("userId") || !params.get("secret")) {
      setStatus("error");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (!userId || !secret) {
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await account.updateRecovery(userId, secret, password, confirm);
      setStatus("success");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError("Failed to reset password. Try again or request a new link.");
      setStatus("error");
    }
  };

  if (status === "success") return <div className="text-green-500 text-center mt-10">Password reset! Redirecting to sign in...</div>;
  if (status === "error") return <div className="text-red-500 text-center mt-10">Invalid or expired reset link.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-dark-2 p-8 rounded-lg flex flex-col gap-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="shad-input"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="shad-input"
          required
        />
        <button type="submit" className="shad-button_primary">Reset Password</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default ResetPassword; 