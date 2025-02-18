import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";


export default function ExperiencePreview() {
  const { formData } = useFormContext();
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-[#FF6B6B] mb-3 border-b-2 border-[#FF6B6B] pb-1">
        Professional Experience
      </h3>
      <div className="space-y-6">
        {formData?.experience?.map((experience: any, index: number) => (
          <div key={index} className="grid grid-cols-[1fr,2fr] gap-4">
            <div>
              <div className="text-[#FF6B6B]">
                {experience?.startDate}
                {experience?.startDate &&
                  (experience?.endDate || experience?.endDate === "") &&
                  " to "}
                {experience?.startDate && experience?.endDate == ""
                  ? "Present"
                  : experience.endDate}
              </div>
              <div className="text-gray-600">
                {experience?.city}
                {experience?.city && experience?.state && ", "}
                {experience?.state}
              </div>
            </div>
            <div>
              <div className="font-semibold">{experience?.companyName}</div>
              <div className="italic">
                {experience?.title}
              </div>
              <div className="text-gray-700 mt-1">{experience?.workSummary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

