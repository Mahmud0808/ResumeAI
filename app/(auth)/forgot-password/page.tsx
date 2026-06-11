"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/actions/auth.actions";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPasswordReset(email);
    setIsLoading(false);
    // Always show the same confirmation — never reveal whether the email exists.
    setSent(true);
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

        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-primary-700" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              If an account exists for <span className="font-medium">{email}</span>,
              a password reset link is on its way. The link expires in 1 hour.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Forgot password
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your email and we&apos;ll send a reset link.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/sign-in"
            className="font-semibold text-primary-700 hover:text-primary-800 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
