"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { resendVerification } from "@/lib/actions/auth.actions";
import { motion } from "framer-motion";

const CheckEmailPage = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isLoading, setIsLoading] = useState(false);

  const onResend = async () => {
    if (!email) return;
    setIsLoading(true);
    await resendVerification(email);
    setIsLoading(false);
    toast({
      title: "Verification email sent",
      description: "Check your inbox for a fresh link.",
      className: "bg-white",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl"
      >
        <MailCheck className="mx-auto h-12 w-12 text-primary-700" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Your email isn&apos;t verified yet. We sent a verification link
          {email ? (
            <>
              {" "}to <span className="font-medium">{email}</span>
            </>
          ) : null}
          . Click it to activate your account, then sign in. The link expires in
          24 hours.
        </p>

        {email && (
          <Button
            type="button"
            variant="outline"
            onClick={onResend}
            disabled={isLoading}
            className="mt-6 w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
              </>
            ) : (
              "Resend link"
            )}
          </Button>
        )}

        <Link
          href="/sign-in"
          className="mt-3 inline-block w-full rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          Back to sign in
        </Link>
      </motion.div>
    </div>
  );
};

export default CheckEmailPage;
