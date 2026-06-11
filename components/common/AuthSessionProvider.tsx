"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";

const AuthSessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  // `session` is seeded from the server (see app/layout.tsx) so useSession()
  // resolves synchronously on first render instead of firing a client-side
  // fetch to /api/auth/session — removes the auth "loading" flash in the header.
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
};

export default AuthSessionProvider;
