import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmailToken } from "@/lib/actions/auth.actions";

// Verification links are one-time and side-effecting, so this must never be
// statically cached.
export const dynamic = "force-dynamic";

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const { token } = await searchParams;
  const result = token
    ? await verifyEmailToken(token)
    : { success: false, error: "Missing verification token." };

  const ok = result.success;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        {ok ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
        )}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {ok ? "Email verified" : "Verification failed"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {ok
            ? "Your email is confirmed. You can now sign in."
            : result.error ??
              "This link is invalid or has expired. Request a new one from the sign-in page."}
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
