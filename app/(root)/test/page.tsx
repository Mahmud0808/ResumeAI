import FinalResumeView from "@/components/layout/ResumeView";
import React from "react";
import { Metadata } from "next";
import {
  checkResumeOwnership,
  fetchResume,
} from "@/lib/actions/resume.actions";
import { currentUser } from "@clerk/nextjs/server";

import PersonalDetailsPreview from "@/components/layout/template_1/personal-details-preview"
import SummaryPreview from "@/components/layout/template_1/summary-preview"
import ExperiencePreview from "@/components/layout/template_1/experience-preview"
import EducationalPreview from "@/components/layout/template_1/educational-preview"
import SkillsPreview from "@/components/layout/template_1/skills-preview"
import ProjectsPreview from "@/components/layout/template_1/projects-preview"



const MyResume = ( )=> {
  return(
  <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border-[#FF6B6B] border-8 rounded-lg shadow-lg">
        <div className="p-8 space-y-6">
          <PersonalDetailsPreview />
          <SummaryPreview />
          <ExperiencePreview />
          <EducationalPreview />
          <SkillsPreview />
          <ProjectsPreview />
        </div>
      </div>
    </div>
  )
};

export default MyResume;
