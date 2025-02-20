import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";


export default function ExperiencePreview() {
  const { formData } = useFormContext();
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 bg-gray-100 p-2 flex items-center gap-2">
        <span>PROFESSIONAL EXPERIENCE</span>
      </h3>
      <div className="space-y-6">
        {formData?.experience?.map((experience: any, index: number) => (
          <div key={index} className="space-y-2">
            <div>
              <h4 className="font-bold">{experience?.companyName}</h4>
              <p className="text-gray-600">{experience?.title}</p>
              <p className="text-sm text-gray-500">
                {experience?.startDate}
                {experience?.startDate &&
                  (experience?.endDate || experience?.endDate === "") &&
                  " to "}
                {experience?.startDate && experience?.endDate == ""
                  ? "Present"
                  : experience.endDate}
              </p>
            </div>
            <div className="list-disc pl-4 space-y-1 text-xs">
                {experience?.workSummary}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

