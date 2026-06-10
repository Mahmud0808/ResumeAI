import React from "react";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import { getCurrentUserId } from "@/lib/auth";
import { checkResumeOwnership } from "@/lib/actions/resume.actions";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/layout/my-resume/ResumeEditor";

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
      <ResumeEditor params={{ id }} userId={userId ?? undefined} />
    </PageWrapper>
  );
};

export default EditResume;
