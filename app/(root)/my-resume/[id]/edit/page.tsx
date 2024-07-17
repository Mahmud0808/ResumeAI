import React, { use } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import { currentUser } from "@clerk/nextjs/server";
import { checkResumeOwnership } from "@/lib/actions/resume.actions";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/layout/my-resume/ResumeEditor";

const EditResume = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const isResumeOwner = await checkResumeOwnership(user?.id || "", params.id);

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
      <ResumeEditor params={params} userId={user?.id} />
    </PageWrapper>
  );
};

export default EditResume;
