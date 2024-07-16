"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ThemeColor from "@/components/layout/ThemeColor";

const ResumeEditForm = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <ThemeColor params={params} />
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
            onClick={() =>
              activeFormIndex == 5
                ? router.push("/my-resume/" + params.id + "/view")
                : setActiveFormIndex(activeFormIndex + 1)
            }
          >
            {activeFormIndex == 5 ? (
              <>
                Finish <CheckCircle2 className="size-5" />
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
        <SkillsForm params={params} />
      ) : activeFormIndex == 6 ? (
        redirect("/my-resume/" + params.id + "/view")
      ) : null}
    </div>
  );
};

export default ResumeEditForm;
