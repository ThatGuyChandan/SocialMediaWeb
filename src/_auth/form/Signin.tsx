import { SigninValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { account } from "@/lib/appwrite/config";

function Signin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();

  const { mutateAsync: signInAccount } = useSignInAccount();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading state
  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    setError("");
    setLoading(true);
    try {
      // 1. Try to create a session (login)
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      if (!session) {
        throw new Error("No session returned from server.");
      }
      // 2. Wait for session to be established, then fetch user
      const user = await account.get();
      if (!user) {
        throw new Error("Failed to fetch user after login.");
      }
      // 3. Update your app state/context with the user info
      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.message || "Failed to sign in. Please try again.";
      setError(msg);
      toast({ title: "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col ">
        <img src="/assets/images/GlimmerWave.png" className="w-36 h-26" />
        <h2 className="h3-bold md:h2-bold pt-5 mb-5">Log in to your account</h2>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-4 "
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="shad-input" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="shad-input pr-10"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-4 text-lg focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Button type="submit" className="shad-button_primary">
          {loading ? (
            <div className="flex-center gap-2">
              <Loader />
              Loading.....
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
        <p className="text-small-regular text-light-2  text-center mt-2">
          Don't have an acount ?{" "}
          <Link to="/signup" className="text-red underline text-small-semibold">
            Sign up
          </Link>
        </p>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-400 underline">Forgot Password?</Link>
        </div>
      </form>
    </Form>
  );
}

export default Signin;
