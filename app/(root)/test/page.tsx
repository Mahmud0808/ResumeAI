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
  return (
    <div className="flex items-center justify-center">
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[400px,1fr] bg-white shadow-lg">
        <div className="bg-[#1B2A3B] p-8 space-y-8">
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
    </div>
  );
};

export default ResumePreview;