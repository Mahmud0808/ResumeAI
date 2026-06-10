import React from "react";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import { getCurrentUserId } from "@/lib/auth";
import { checkResumeOwnership } from "@/lib/actions/resume.actions";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/layout/my-resume/ResumeEditor";
import { FadeIn } from "@/components/common/motion";

const EditResume = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const isResumeOwner = await checkResumeOwnership(id);

  if (!isResumeOwner) {
    return redirect("/dashboard");
  }

  return (
    <PageWrapper>
      <Header />
      <FadeIn className="my-8 mx-6 sm:mx-10 md:my-10 md:mx-20 lg:mx-36">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Edit Your Resume
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600 md:text-base">
          Please provide the necessary information for your resume.
        </p>
      </FadeIn>
      <ResumeEditor params={{ id }} userId={userId ?? undefined} />
    </PageWrapper>
  );
};

export default EditResume;
