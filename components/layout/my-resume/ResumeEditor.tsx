"use client";

import { FormProvider } from "@/lib/context/FormProvider";
import React, { useEffect, useState } from "react";
import ResumeEditForm from "./ResumeEditForm";
import ResumeTemplateSelector from "@/components/layout/my-resume/ResumeTemplateSelector";


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


  // const [selectedTemplate, setSelectedTemplate] = useState(4); // default template

  return (
    <FormProvider params={params}>
      <div className="p-10 max-sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center items-start pb-16 max-sm:pb-8">
          <ResumeEditForm
            params={params}
            userId={userId}
            // selectedTemplate={selectedTemplate}
            // setSelectedTemplate={setSelectedTemplate}
          />
          <ResumeTemplateSelector/>
        </div>
      </div>
    </FormProvider>
  );
};

export default ResumeEditor;
