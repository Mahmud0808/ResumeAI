import { useFormContext } from "@/lib/context/FormProvider";
import React from "react";
import PersonalDetailsPreview from "./previews/PersonalDetailsPreview";
import SkillsPreview from "./previews/SkillsPreview";
import SummaryPreview from "./previews/SummaryPreview";
import ExperiencePreview from "./previews/ExperiencePreview";
import EducationalPreview from "./previews/EducationalPreview";
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
      <div
        className="shadow-lg p-14 border-t-[20px] bg-white w-[210mm] min-h-[297mm] print:shadow-none"
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      >
        <PersonalDetailsPreview />
        <SummaryPreview />
        {formData?.experience?.length > 0 && <ExperiencePreview />}
        {formData?.education?.length > 0 && <EducationalPreview />}
        {formData?.skills?.length > 0 && <SkillsPreview />}
      </div>
    </div>
  );
};

export default ResumePreview;
