"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signUpWithCredentials } from "@/lib/actions/auth.actions";
import GoogleIcon from "@/components/common/GoogleIcon";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    setIsLoading(true);

    const result = await signUpWithCredentials({ name, email, password });

    if (!result.success) {
      setIsLoading(false);
      toast({
        title: "Sign up failed",
        description: result.error,
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (signInResult?.error) {
      router.push("/sign-in");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8"
      >
        <Link href="/" className="mb-6 flex items-center gap-2">
          <img src="/icons/logo.svg" className="h-8" alt="logo" />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ResumeAI
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Start building a professional resume in minutes.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full"
          disabled={isGoogleLoading}
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google", { callbackUrl: "/dashboard" });
          }}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
            </>
          )}
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-700 text-white hover:bg-primary-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary-700 transition-colors hover:text-primary-800 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
