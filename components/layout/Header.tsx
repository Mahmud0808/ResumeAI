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
      <nav className="border-b border-slate-200/60 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur-xl sm:px-6">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="group flex items-center">
            <motion.img
              whileHover={{ rotate: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              src="/icons/logo.svg"
              className="mr-3 h-7 sm:h-9"
              alt="logo"
            />
            <span className="self-center text-lg font-bold tracking-tight whitespace-nowrap text-slate-900 sm:text-xl">
              ResumeAI
            </span>
          </Link>
          <div className="flex items-center gap-1 lg:order-2 sm:gap-2">
            {isLoaded && !isSignedIn ? (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/sign-in"
                  className="inline-block text-gray-800 hover:bg-primary-700/10 duration-300 focus:ring-4 focus:ring-primary-700/30 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-1 focus:outline-none"
                >
                  Log in
                </Link>
              </motion.div>
            ) : (
              <div className="mr-2 h-full items-center align-middle flex justify-center sm:mr-4">
                <UserMenu />
              </div>
            )}
            {!(isSignedIn && isOnDashboard) && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={`${!isSignedIn ? "/sign-up" : "/dashboard"}`}
                  className="inline-block text-white bg-primary-700 hover:bg-primary-800 shadow-md shadow-primary-700/20 hover:shadow-lg hover:shadow-primary-700/30 transition-shadow focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
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
