import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite/config";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [status, setStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (userId && secret) {
      account.updateVerification(userId, secret)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, []);

  if (status === "pending") return <div className="text-center mt-10">Verifying your email...</div>;
  if (status === "success") return <div className="text-green-500 text-center mt-10">Email verified! You can now <span className="underline cursor-pointer" onClick={() => navigate('/signin')}>sign in</span>.</div>;
  return <div className="text-red-500 text-center mt-10">Verification failed. Please check your link or try again.</div>;
};

export default VerifyEmail; 