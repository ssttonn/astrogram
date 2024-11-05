import * as z from "zod";

export const RegisterValidationSchema = z.object({
  name: z.string().min(2, { message: "Name too short, must contains at least 2 characters." }),
  username: z.string().min(2, {message: "Username too short, must contains at least 2 characters."}),
  email: z.string().email(),
  password: z.string().min(8, {message: "Password must be at least 8 characters."})
});

export const LoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message: "Password must be at least 8 characters."})
})

export const PostValidationSchema = z.object({
  caption: z.string().min(5).max(2200),
  files: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string()
})
