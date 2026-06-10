"use client";

import { FormProvider } from "@/lib/context/FormProvider";
import React from "react";
import ResumeEditForm from "./ResumeEditForm";
import ResumePreview from "./ResumePreview";
import ThemeColor from "@/components/layout/ThemeColor";
import TemplatePicker from "@/components/layout/TemplatePicker";
import DateFormatPicker from "@/components/layout/DateFormatPicker";
import SectionVisibility from "@/components/layout/SectionVisibility";
import { FadeIn } from "@/components/common/motion";

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
      <FadeIn className="my-8 mx-6 sm:mx-10 md:my-10 md:mx-20 lg:mx-36">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Edit Your Resume
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600 md:text-base">
          Please provide the necessary information for your resume.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <ThemeColor params={params} />
          <TemplatePicker params={params} />
          <DateFormatPicker params={params} />
          <SectionVisibility params={params} />
        </div>
      </FadeIn>
      <div className="px-10 pt-2 pb-2 max-sm:px-4 max-sm:pt-2 max-sm:pb-0 lg:h-[calc(100vh-50px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 justify-center items-start h-[calc(100%-5px)] max-sm:h-[calc(100%-2rem)] overflow-hidden">
          <div className="h-full overflow-y-auto no-scrollbar p-1">
            <ResumeEditForm params={params} userId={userId} />
          </div>
          <div className="h-full overflow-y-auto no-scrollbar p-1">
            <ResumePreview />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ResumeEditor;
