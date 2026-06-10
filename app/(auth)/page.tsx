"use client";

import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  AtomIcon,
  Edit,
  Share2,
  Sparkles,
  Wand2,
  Eye,
  Link2,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
  staggerItemVariants,
} from "@/components/common/motion";

const featureCards = [
  {
    icon: AtomIcon,
    step: "01",
    title: "Create Your Template",
    description:
      "Start by selecting the color scheme for your resume template. Our single, professionally designed template ensures a clean and consistent look for all users.",
  },
  {
    icon: Edit,
    step: "02",
    title: "Update Your Information",
    description:
      "Enter your personal details, work experience, education, and skills into the provided form. Our AI assists you in filling out each section accurately and effectively.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share Your Resume",
    description:
      "After completing your resume, save it securely and generate a shareable link. Easily update your information anytime and share the link with potential employers or download it in a preferred format.",
  },
];

const highlights = [
  { icon: Wand2, label: "AI-assisted writing" },
  { icon: Eye, label: "Live preview" },
  { icon: Link2, label: "One-click sharing" },
];

const page = () => {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  return (
    <div className="relative min-h-full overflow-x-clip">
      <Header />

      {/* Hero */}
      <section className="relative">
        <StaggerContainer className="mx-auto max-w-screen-xl px-6 py-14 text-center md:px-10 lg:px-12 lg:py-24">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur-md sm:text-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Builder
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight leading-[1.1] text-slate-900 sm:text-5xl lg:text-7xl">
              Build a resume that{" "}
              <span className="relative whitespace-nowrap">
                <span className="bg-gradient-to-r from-primary-700 via-sky-500 to-purple-500 bg-clip-text text-transparent">
                  gets you hired
                </span>
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
              Effortlessly craft a professional resume with our AI-powered
              builder — write less, impress more.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href={`${!isSignedIn ? "/sign-up" : "/dashboard"}`}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-700 px-8 text-base font-semibold text-white shadow-lg shadow-primary-700/30 transition-colors hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="#learn-more"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-200/90 bg-white/70 px-8 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:border-slate-300 hover:bg-white sm:w-auto"
                >
                  Learn more
                </Link>
              </motion.div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {highlights.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"
                >
                  <Icon className="h-4 w-4 text-primary-600" />
                  {label}
                </span>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-screen-xl px-6 py-12 text-center md:px-10 lg:px-12">
        <RevealOnScroll>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            How it works
          </span>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            id="learn-more"
          >
            Generate a resume in 3 steps
          </h2>
          <p className="mt-2 text-slate-500">
            From blank page to polished resume in minutes.
          </p>
        </RevealOnScroll>

        <StaggerContainer
          whileInView
          className="mt-12 grid grid-cols-1 gap-6 text-center md:grid-cols-2 md:gap-8 md:text-start lg:grid-cols-3"
        >
          {featureCards.map(({ icon: Icon, step, title, description }) => (
            <motion.div
              key={title}
              variants={staggerItemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="group relative flex cursor-pointer flex-col items-center justify-start overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-600/5 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary-700/10 sm:p-8 md:items-start"
            >
              <span className="absolute -right-2 -top-4 select-none text-7xl font-extrabold tracking-tighter text-slate-100 transition-colors group-hover:text-primary-100">
                {step}
              </span>

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-sky-100 text-primary-700 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="relative mt-5 text-lg font-bold text-slate-900 sm:text-xl">
                {title}
              </h2>

              <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-screen-xl px-6 py-14 md:px-10 lg:px-12">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900 px-6 py-12 text-center shadow-2xl shadow-primary-900/30 sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute -top-16 left-1/4 h-48 w-48 rounded-full bg-sky-400/30 blur-[80px]" />
              <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-purple-400/30 blur-[80px]" />
            </div>
            <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Ready to land your next role?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm text-primary-100 sm:text-base">
              Create a professional, AI-polished resume and share it with the
              world — all in one place.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative mt-8 inline-block"
            >
              <Link
                href={`${!isSignedIn ? "/sign-up" : "/dashboard"}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-primary-800 shadow-lg transition-colors hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-white/40 sm:px-12"
              >
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-2 p-5 text-center md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-slate-500">
            © 2024{" "}
            <span className="font-medium text-slate-700 transition-colors hover:cursor-pointer hover:text-primary-600">
              ResumeAI™
            </span>
            . All Rights Reserved.
          </span>
          <Link href="https://github.com/Mahmud0808" className="md:me-2">
            <span className="text-sm font-medium text-slate-500 transition-colors hover:text-primary-600">
              Made with ❤️ by Mahmud
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default page;
