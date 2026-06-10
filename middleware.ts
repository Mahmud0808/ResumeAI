import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Edge-safe middleware. The `authorized` callback in auth.config protects
// /dashboard and /my-resume/:id/edit and redirects anonymous users to /sign-in.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
