import { useState } from "react";
import { account } from "@/lib/appwrite/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await account.createRecovery(email, "http://localhost:3000/reset-password");
      setSent(true);
    } catch (err) {
      setError("Failed to send reset email. Please check your email address.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-dark-2 p-8 rounded-lg flex flex-col gap-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="shad-input"
          required
        />
        <button type="submit" className="shad-button_primary">Send Reset Email</button>
        {sent && <div className="text-green-500">Reset email sent! Check your inbox.</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default ForgotPassword; 