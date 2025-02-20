import { useFormContext } from "@/lib/context/FormProvider";
import React from "react";
import PersonalDetailsPreview from "@/components/layout/my-resume/template_3/previews/personal-details-preview";
import SkillsPreview from "@/components/layout/my-resume/template_3/previews/skills-preview";
import SummaryPreview from "@/components/layout/my-resume/template_3/previews/summary-preview";
import ExperiencePreview from "@/components/layout/my-resume/template_3/previews/experience-preview";
import EducationalPreview from "@/components/layout/my-resume/template_3/previews/educational-preview";
import ProjectsPreview from "@/components/layout/my-resume/template_3/previews/projects-preview";
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
    <div className="flex items-center justify-center">
      <div className="grid md:grid-cols-[300px,1fr] bg-white shadow-lg w-[210mm] min-h-[297mm] print:shadow-none">
        <div 
        className="p-8 space-y-8"
        style={{backgroundColor :formData?.themeColor || themeColors[0],}}>
          <PersonalDetailsPreview />
          <SummaryPreview />
          <SkillsPreview />
        </div>
        <div className="p-8 space-y-8">
          <ExperiencePreview />
          <EducationalPreview />
          <ProjectsPreview />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;