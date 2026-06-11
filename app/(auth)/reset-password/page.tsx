"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "@/lib/actions/auth.actions";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter the same password.",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    setIsLoading(true);
    const result = await resetPassword({ token, newPassword });
    setIsLoading(false);

    if (!result.success) {
      toast({
        title: "Could not reset password",
        description: result.error,
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    toast({
      title: "Password reset",
      description: "You can now sign in with your new password.",
      className: "bg-white",
    });
    router.push("/sign-in");
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
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter a new password for your account.
        </p>

        {!token ? (
          <p className="mt-6 text-sm text-red-600">
            Missing or invalid reset link. Request a new one from the{" "}
            <Link href="/forgot-password" className="font-semibold underline">
              forgot password
            </Link>{" "}
            page.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                New password
              </label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="mt-1"
              />
              <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Confirm new password
              </label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-700 text-white hover:bg-primary-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
