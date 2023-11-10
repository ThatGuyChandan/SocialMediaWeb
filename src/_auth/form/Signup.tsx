import { SignupValidation } from "@/lib/validation";
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
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigninIn } =
    useSignInAccount();
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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const newUser = await createUserAccount(values);
      console.log("New user created:", newUser);

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      if (!session) {
        toast({
          title: "Something went wrong. Please login your new account",
        });

        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();
      console.log("Is user logged in:", isLoggedIn);

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Sign up failed, please try again" });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({ title: "Sign up failed, please try again" });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col ">
        <img src="/assets/images/GlimmerWave.png" className="w-36 h-26" />
        <h2 className="h3-bold md:h2-bold pt-5 mb-5">Create new account</h2>
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
        <Button type="submit" className="shad-button_primary">
          {isCreatingAccount || isSigninIn || isUserLoading ? (
            <div className="flex-center gap-2">
              <Loader />
              Loading.....
            </div>
          ) : (
            "sign up"
          )}
        </Button>
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
