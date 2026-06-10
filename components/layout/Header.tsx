"use client";

import { useSession } from "next-auth/react";
import UserMenu from "@/components/common/UserMenu";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoaded = status !== "loading";
  const isSignedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50">
      <nav className="backdrop-blur-md px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <img src="/icons/logo.svg" className="mr-3 h-7 sm:h-9" alt="logo" />
            <span className="self-center text-xl font-bold whitespace-nowrap">
              ResumeAI
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            {isLoaded && !isSignedIn ? (
              <Link
                href="/sign-in"
                className="text-gray-800 hover:bg-primary-700/10 duration-300 focus:ring-4 focus:ring-primary-700/30 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Log in
              </Link>
            ) : (
              <div className="mr-4 h-full items-center align-middle flex justify-center">
                <UserMenu />
              </div>
            )}
            <Link
              href={`${!isSignedIn ? "/sign-up" : "/dashboard"}`}
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
            >
              {!isSignedIn ? "Get started" : "Dashboard"}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
