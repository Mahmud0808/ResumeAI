import { useFormContext } from "@/lib/context/FormProvider";
import React from "react";
import PersonalDetailsPreview from "@/components/layout/my-resume/template_2/previews/PersonalDetailsPreview";
import SkillsPreview from "@/components/layout/my-resume/template_2/previews/SkillsPreview";
import SummaryPreview from "@/components/layout/my-resume/template_2/previews/SummaryPreview";
import ExperiencePreview from "@/components/layout/my-resume/template_2/previews/ExperiencePreview";
import EducationalPreview from "@/components/layout/my-resume/template_2/previews/EducationalPreview";
import ProjectsPreview from "@/components/layout/my-resume/template_2/previews/ProjectsPreview";
import { themeColors } from "@/lib/utils";

const ResumeTemplate2 = () => {
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
      <div
        className="shadow-lg p-14 bg-white w-[210mm] min-h-[297mm] print:shadow-none"
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      >
        <PersonalDetailsPreview />
        <SummaryPreview />
        {formData?.experience?.length > 0 && <ExperiencePreview />}
        {formData?.education?.length > 0 && <EducationalPreview />}
        {formData?.projects?.length > 0 && <ProjectsPreview />}
        {formData?.skills?.length > 0 && <SkillsPreview />}
      </div>
    </div>
  );
};

export default ResumeTemplate2;
