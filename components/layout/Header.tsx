"use client";

import { useSession } from "next-auth/react";
import UserMenu from "@/components/common/UserMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoaded = status !== "loading";
  const isSignedIn = !!session?.user;
  const isOnDashboard = pathname === "/dashboard";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50"
    >
      {/* Signature gradient strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary-600 via-sky-400 to-purple-500" />

      <nav className="border-b border-slate-900/10 bg-white/60 px-4 py-3 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 sm:px-6">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative inline-flex">
              <span className="absolute inset-0 rounded-full bg-primary-400/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              <motion.img
                whileHover={{ rotate: -8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                src="/icons/logo.svg"
                className="relative h-7 sm:h-8"
                alt="logo"
              />
            </span>
            <span className="self-center text-lg font-extrabold tracking-tight whitespace-nowrap sm:text-xl">
              <span className="text-slate-900">Resume</span>
              <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 lg:order-2">
            {isLoaded && !isSignedIn ? (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/sign-in"
                  className="inline-block rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-900/5 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-700/20 lg:px-5 lg:py-2.5"
                >
                  Log in
                </Link>
              </motion.div>
            ) : (
              <div className="mr-2 flex h-full items-center justify-center align-middle sm:mr-4">
                <UserMenu />
              </div>
            )}
            {!(isSignedIn && isOnDashboard) && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={`${!isSignedIn ? "/sign-up" : "/dashboard"}`}
                  className="inline-block rounded-full bg-gradient-to-r from-primary-700 to-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-700/25 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-700/40 focus:outline-none focus:ring-4 focus:ring-primary-300 lg:px-5 lg:py-2.5"
                >
                  {!isSignedIn ? "Get started" : "Dashboard"}
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
