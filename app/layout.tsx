import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          logoImageUrl: "/icons/logo.svg",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${nunito.variable} font-inter`}>
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
