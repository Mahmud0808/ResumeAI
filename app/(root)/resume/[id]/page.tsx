import FinalResumeView from "@/components/layout/ResumeView";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  canViewResume,
  checkResumeOwnership,
  fetchResume,
} from "@/lib/actions/resume.actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchResume(id);
  const resume = JSON.parse(data || "{}");

  if (resume?.firstName === undefined && resume?.lastName === undefined) {
    return {
      title: "ResumeAI - Professional AI Resume Builder",
      description:
        "Generate a polished, professional resume in just a few clicks with our AI-powered resume builder.",
    };
  }

  const fullName =
    `${resume?.firstName ?? ""} ${resume?.lastName ?? ""}`.trim() || "User";
  const title = `${fullName} - ResumeAI`;
  const description = `${fullName}'s Resume. Powered by ResumeAI.`;
  const url = `/resume/${id}`;

  return {
    title,
    description,
    // Rich link preview for Messenger / social. The og:image + twitter:image
    // are injected automatically by the per-resume opengraph-image.tsx in this
    // route segment, so they are intentionally omitted here.
    openGraph: {
      title,
      description,
      url,
      siteName: "ResumeAI",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const MyResume = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const [isResumeOwner, viewable] = await Promise.all([
    checkResumeOwnership(id),
    canViewResume(id),
  ]);

  if (!viewable) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          This resume is private
        </h2>
        <p className="text-gray-600">
          The owner has not shared this resume publicly.
        </p>
        <Link href="/" className="font-semibold text-primary-700">
          Go home
        </Link>
      </div>
    );
  }

  return <FinalResumeView params={{ id }} isOwnerView={isResumeOwner} />;
};

export default MyResume;
