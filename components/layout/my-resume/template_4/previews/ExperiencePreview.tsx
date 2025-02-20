import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const ExperiencePreview = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 
      className="font-semibold text-lg border-b-2 pb-1"
      style={{
        color: formData?.themeColor || themeColors[0],
        borderBottomColor: formData?.themeColor || themeColors[0],
      }}>PROFESSIONAL EXPERIENCE</h3>
      <div className="space-y-6">
        {formData?.experience?.map((experience: any, index: number) => (
          <div key={index} className="space-y-1">
            <div className="font-semibold text-gray-900">{experience?.title} | {experience?.companyName}</div>
            <div className="text-gray-600">{experience?.city}, {experience?.state}</div>
            <div className="text-gray-600">
            {experience?.startDate}
              {experience?.startDate &&
                (experience?.endDate || experience?.endDate === "") &&
                " to "}
              {experience?.startDate && experience?.endDate == ""
                ? "Present"
                : experience.endDate}
            </div>
            <div className="text-gray-700 text-sm">
            {experience?.workSummary && (
            <div
              className="text-xs my-2 form-preview"
              dangerouslySetInnerHTML={{
                __html: experience?.workSummary,
              }}
            />
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePreview;
