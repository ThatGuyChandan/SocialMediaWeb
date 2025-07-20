import { SignupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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
import {
  useCreateUserAccount,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { account } from "@/lib/appwrite/config";
import { useState, useEffect } from "react";
function Signup() {
  const { toast } = useToast();
  const { isLoading: isCreatingAccount } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setError("");
    setVerificationSent(false);
    form.reset();
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    setError("");
    try {
      // Always clear any existing session before sign-up
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore if no session exists
      }
      const newUser = await createUserAccount(values);
      console.log("New user created:", newUser);
      // If email verification is enabled, do NOT auto-login
      await account.createVerification("http://localhost:3000/verify");
      setVerificationSent(true);
      // Optionally: navigate("/signin"); // or just show the verification message
    } catch (error: any) {
      const msg = error?.message || "Failed to sign up. Please try again.";
      setError(msg);
      toast({ title: "Sign up failed", description: msg, variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col ">
        <img src="/assets/images/GlimmerWave.png" className="w-36 h-26" />
        <h2 className="h3-bold md:h2-bold pt-5 mb-5">Create a new account</h2>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-4 "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name:</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="shad-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username:</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="shad-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>Password:</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="shad-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Button type="submit" className="shad-button_primary">
          {isCreatingAccount ? (
            <div className="flex-center gap-2">
              <Loader />
              Loading.....
            </div>
          ) : (
            "sign up"
          )}
        </Button>
        {verificationSent && (
          <div className="text-green-500 text-center mt-4">
            Verification email sent! Please check your inbox and follow the link to verify your account.
          </div>
        )}
        <p className="text-small-regular text-light-2  text-center mt-2">
          Already have an acount ?{" "}
          <Link to="/signin" className="text-red underline text-small-semibold">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}

export default Signup;
