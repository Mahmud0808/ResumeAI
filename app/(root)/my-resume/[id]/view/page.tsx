import FinalResumeView from "@/components/layout/ResumeView";
import React from "react";
import { Metadata } from "next";
import {
  checkResumeOwnership,
  fetchResume,
} from "@/lib/actions/resume.actions";
import { currentUser } from "@clerk/nextjs/server";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await fetchResume(params.id);
  const resume = JSON.parse(data || "{}");

  if (resume?.firstName === undefined && resume?.lastName === undefined) {
    return {
      title: "ResumeAI - Professional AI Resume Builder",
      description:
        "Generate a polished, professional resume in just a few clicks with our AI-powered resume builder.",
    };
  }

  return {
    title: `${resume?.firstName}${resume?.firstName && " "}
    ${resume?.lastName}${resume?.lastName && " "}- ResumeAI`,
    description: `${resume?.firstName} ${resume?.lastName}'s Resume. Powered by ResumeAI.`,
  };
}

const MyResume = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const isResumeOwner = await checkResumeOwnership(user?.id || "", params.id);

  return <FinalResumeView params={params} isOwnerView={isResumeOwner} />;
};

export default MyResume;
