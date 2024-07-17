"use client";

import { FormProvider } from "@/lib/context/FormProvider";
import React from "react";
import ResumeEditForm from "./ResumeEditForm";
import ResumePreview from "./ResumePreview";

const ResumeEditor = ({
  params,
  userId,
}: {
  params: { id: string };
  userId: string | undefined;
}) => {
  if (!userId) {
    return null;
  }

  return (
    <FormProvider params={params}>
      <div className="p-10 max-sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center items-start pb-16 max-sm:pb-8">
          <ResumeEditForm params={params} userId={userId} />
          <ResumePreview />
        </div>
      </div>
    </FormProvider>
  );
};

export default ResumeEditor;
