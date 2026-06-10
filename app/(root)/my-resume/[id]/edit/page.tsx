import React from "react";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import { getCurrentUserId } from "@/lib/auth";
import { checkResumeOwnership } from "@/lib/actions/resume.actions";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/layout/my-resume/ResumeEditor";

const EditResume = async ({ params }: { params: { id: string } }) => {
  const userId = await getCurrentUserId();
  const isResumeOwner = await checkResumeOwnership(params.id);

  if (!isResumeOwner) {
    return redirect("/dashboard");
  }

  return (
    <PageWrapper>
      <Header />
      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <h2 className="text-center text-2xl font-bold">Edit Your Resume</h2>
        <p className="text-center text-gray-600">
          Please provide the necessary information for your resume.
        </p>
      </div>
      <ResumeEditor params={params} userId={userId ?? undefined} />
    </PageWrapper>
  );
};

export default EditResume;
