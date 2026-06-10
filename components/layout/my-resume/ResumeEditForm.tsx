"use client";

import React from "react";
import { Button } from "../../ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ThemeColor from "@/components/layout/ThemeColor";
import TemplatePicker from "@/components/layout/TemplatePicker";
import { useToast } from "@/components/ui/use-toast";
import { useFormContext } from "@/lib/context/FormProvider";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { sanitizeNbsp } from "@/lib/utils";

// Slides forward on Next, backward on Prev (direction: 1 or -1).
const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 24 * direction }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: -24 * direction }),
};
import {
  addEducationToResume,
  addExperienceToResume,
  addSkillToResume,
  updateResume,
} from "@/lib/actions/resume.actions";

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
  const { formData, activeFormIndex, setActiveFormIndex } = useFormContext();
  const [isLoading, setIsLoading] = React.useState(false);

  // Animation-only: remembers the previous step to derive slide direction.
  const prevIndexRef = React.useRef(activeFormIndex);
  const direction = activeFormIndex >= prevIndexRef.current ? 1 : -1;
  React.useEffect(() => {
    prevIndexRef.current = activeFormIndex;
  }, [activeFormIndex]);

  return (
    <div className="flex flex-col gap-5">
      <div className="sticky top-0 z-10 -mx-1 flex justify-between gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl">
        <div className="flex gap-2">
          <ThemeColor params={params} />
          <TemplatePicker params={params} />
        </div>
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
              if (activeFormIndex !== 5) {
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
                  // Keep stored HTML ATS-friendly: no &nbsp; runs from Quill.
                  (updates.experience ?? []).map((entry: any) => ({
                    ...entry,
                    workSummary: sanitizeNbsp(entry?.workSummary || ""),
                  }))
                );

                const educationResult = await addEducationToResume(
                  params.id,
                  updates.education
                );

                const skillsResult = await addSkillToResume(
                  params.id,
                  updates.skills
                );

                setIsLoading(false);

                if (
                  updateResult.success &&
                  experienceResult.success &&
                  educationResult.success &&
                  skillsResult.success
                ) {
                  router.push("/resume/" + params.id);
                } else {
                  toast({
                    title: "Uh Oh! Something went wrong.",
                    description:
                      updateResult?.error ||
                      experienceResult?.error ||
                      educationResult?.error ||
                      skillsResult?.error,
                    variant: "destructive",
                    className: "bg-white",
                  });
                }
              }
            }}
          >
            {activeFormIndex === 5 ? (
              <>
                {isLoading ? (
                  <>
                    Finishing <Loader2 className="size-5 animate-spin" />
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
      {activeFormIndex === 6 ? (
        redirect("/resume/" + params.id)
      ) : (
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeFormIndex}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeFormIndex === 1 ? (
              <PersonalDetailsForm params={params} />
            ) : activeFormIndex === 2 ? (
              <SummaryForm params={params} />
            ) : activeFormIndex === 3 ? (
              <ExperienceForm params={params} />
            ) : activeFormIndex === 4 ? (
              <EducationForm params={params} />
            ) : activeFormIndex === 5 ? (
              <SkillsForm params={params} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ResumeEditForm;
