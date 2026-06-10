import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Edge-safe proxy (formerly "middleware"). The `authorized` callback in
// auth.config protects /dashboard and /my-resume/:id/edit and redirects
// anonymous users to /sign-in.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
