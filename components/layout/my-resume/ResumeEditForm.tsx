"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ProjectsForm from "./forms/ProjectsForm";
import ThemeColor from "@/components/layout/ThemeColor";
import { useToast } from "@/components/ui/use-toast";
import { useFormContext } from "@/lib/context/FormProvider";
import {
  addEducationToResume,
  addExperienceToResume,
  addSkillToResume,
  addProjectsToResume,
  updateResume,
} from "@/lib/actions/resume.actions";
import TemplateSwitcher from "@/components/common/TemplateSwitcher";

const ResumeEditForm = ({
  params,
  userId,
}: {
  params: { id: string };
  userId: string | undefined;
}) => {
  if (!userId) {
    return null;
  }

  const router = useRouter();
  const { toast } = useToast();
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = useFormContext();


  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <ThemeColor params={params} />
        <TemplateSwitcher></TemplateSwitcher>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              className="flex gap-2 bg-primary-700 hover:bg-primary-800 text-white"
              size="sm"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft /> Prev
            </Button>
          )}
          <Button
            className="flex gap-2 bg-primary-700 hover:bg-primary-800 text-white"
            size="sm"
            disabled={isLoading}
            onClick={async () => {
              if (activeFormIndex != 6) {
                setActiveFormIndex(activeFormIndex + 1);
              } else {
                setIsLoading(true);

                const updates = {
                  firstName: formData?.firstName,
                  lastName: formData?.lastName,
                  jobTitle: formData?.jobTitle,
                  address: formData?.address,
                  phone: formData?.phone,
                  email: formData?.email,
                  summary: formData?.summary,
                  experience: formData?.experience,
                  education: formData?.education,
                  skills: formData?.skills,
                  projects: formData?.projects
                };

                const updateResult = await updateResume({
                  resumeId: params.id,
                  updates: {
                    firstName: updates.firstName,
                    lastName: updates.lastName,
                    jobTitle: updates.jobTitle,
                    address: updates.address,
                    phone: updates.phone,
                    email: updates.email,
                    summary: updates.summary,
                  },
                });

                const experienceResult = await addExperienceToResume(
                  params.id,
                  updates.experience
                );

                const educationResult = await addEducationToResume(
                  params.id,
                  updates.education
                );

                const skillsResult = await addSkillToResume(
                  params.id,
                  updates.skills
                );

                const projectsResult = await addProjectsToResume(
                  params.id,
                  updates.projects
                );

                setIsLoading(false);

                if (
                  updateResult.success &&
                  experienceResult.success &&
                  educationResult.success &&
                  skillsResult.success &&
                  projectsResult.success

                ) {
                  router.push("/my-resume/" + params.id + "/view");
                } else {
                  toast({
                    title: "Uh Oh! Something went wrong.",
                    description:
                      updateResult?.error ||
                      experienceResult?.error ||
                      educationResult?.error ||
                      skillsResult?.error ||
                      projectsResult?.error,
                    variant: "destructive",
                    className: "bg-white",
                  });
                }
              }
            }}
          >
            {activeFormIndex == 6 ? (
              <>
                {isLoading ? (
                  <>
                    Finishing &nbsp; <Loader2 className="size-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Finish <CheckCircle2 className="size-5" />
                  </>
                )}
              </>
            ) : (
              <>
                Next <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
      {activeFormIndex == 1 ? (
        <PersonalDetailsForm params={params} />
      ) : activeFormIndex == 2 ? (
        <SummaryForm params={params} />
      ) : activeFormIndex == 3 ? (
        <ExperienceForm params={params} />
      ) : activeFormIndex == 4 ? (
        <EducationForm params={params} />
      ) : activeFormIndex == 5 ? (
        <ProjectsForm params={params} />
      ) : activeFormIndex == 6 ? (
        <SkillsForm params={params} />
      ) : activeFormIndex == 7 ?
        redirect("/my-resume/" + params.id + "/view")
        : null
      }


    </div>
  );
};

export default ResumeEditForm;
