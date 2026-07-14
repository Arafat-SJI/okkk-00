import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const from = (location.state as any)?.from?.pathname ?? "/dashboard";

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(values.email, values.password);
        // Supabase requires email confirmation by default; in many setups session may be created instantly.
        window.alert("Signup successful. Check your email if confirmation is required. You can now log in.");
        setIsRegister(false);
      } else {
        await signIn(values.email, values.password);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      window.alert(err.message ?? "Authentication error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">{isRegister ? "Sign up" : "Sign in"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register("email")} className="mt-1 block w-full rounded border p-2" />
          {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email.message}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" {...register("password")} className="mt-1 block w-full rounded border p-2" />
          {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password.message}</div>}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
          </Button>

          <button
            type="button"
            className="text-sm underline"
            onClick={() => setIsRegister((s) => !s)}
            aria-label="Toggle register"
          >
            {isRegister ? "Have an account? Sign in" : "Create an account"}
          </button>
        </div>
      </form>
    </div>
  );
}
