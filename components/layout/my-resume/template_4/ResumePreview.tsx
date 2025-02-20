import { useFormContext } from "@/lib/context/FormProvider";
import React from "react";
import PersonalDetailsPreview from "@/components/layout/my-resume/template_4/previews/PersonalDetailsPreview";
import SkillsPreview from "@/components/layout/my-resume/template_4/previews/SkillsPreview";
import SummaryPreview from "@/components/layout/my-resume/template_4/previews/SummaryPreview";
import ExperiencePreview from "@/components/layout/my-resume/template_4/previews/ExperiencePreview";
import EducationalPreview from "@/components/layout/my-resume/template_4/previews/EducationalPreview";
import ProjectsPreview from "@/components/layout/my-resume/template_4/previews/ProjectsPreview";
import { themeColors } from "@/lib/utils";

const ResumePreview = () => {
  const { formData } = useFormContext();

  if (Object.keys(formData || {}).length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-[210mm] min-h-[297mm] rounded-sm shadow-lg skeleton" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[210mm] min-h-[297mm] print:shadow-none bg-white shadow-lg">
        <PersonalDetailsPreview />
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-8">
            <SummaryPreview />
            <ExperiencePreview />
            <EducationalPreview />
          </div>
          <div className="space-y-8">
            <ProjectsPreview />
            <SkillsPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
