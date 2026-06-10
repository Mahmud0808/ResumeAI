import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import AuthSessionProvider from "@/components/common/AuthSessionProvider";
import Providers from "@/components/common/ProgressBarProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "ResumeAI - Professional AI Resume Builder",
  description:
    "Generate a polished, professional resume in just a few clicks with our AI-powered resume builder.",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nunito.variable} font-inter`}>
        <AuthSessionProvider>
          <Providers>{children}</Providers>
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
