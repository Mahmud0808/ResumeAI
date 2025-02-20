import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";


export default function ExperiencePreview() {
  const { formData } = useFormContext();
  return (
    <div className="mb-8">
      <h3 
      className="text-xl font-semibold"
      style={{
        color: formData?.themeColor || themeColors[0],
        marginBottom: "0.75rem", // mb-3 -> 12px (3 * 4px)
        borderBottom: "2px solid",
        borderColor: formData?.themeColor || themeColors[0],
        paddingBottom: "0.25rem", // pb-1 -> 4px (1 * 4px)
      }}>
        Professional Experience
      </h3>
      <div className="space-y-6">
        {formData?.experience?.map((experience: any, index: number) => (
          <div key={index} className="grid grid-cols-[1fr,2fr] gap-4">
            <div>
              <div style={{color : formData?.themeColor || themeColors[0],}}>
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
              <div 
              className="text-gray-500 mt-1 text-sm">{experience?.workSummary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

