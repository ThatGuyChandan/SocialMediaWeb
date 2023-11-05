import * as z from "zod";
export const SignupValidation = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 character long" }),
  username: z
    .string()
    .min(3, { message: "username must be atleast 3 character long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 character long" }),
});
export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 character long" }),
});
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2200 characters" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: "This field is required" })
    .max(100, { message: "Maximum 100 characters." }),
  tags: z.string(),
});
