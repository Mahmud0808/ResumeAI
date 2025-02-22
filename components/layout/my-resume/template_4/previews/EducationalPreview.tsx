import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const EducationalPreview = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 
      className="font-semibold text-lg border-b-2 pb-1"
      style={{
        color: formData?.themeColor || themeColors[0],
        borderBottomColor: formData?.themeColor || themeColors[0],
      }}>EDUCATION</h3>
      <div className="space-y-6">
        {formData?.education?.map((education: any, index: number) => (
          <div key={index} className="space-y-1">
            <div className="font-semibold text-gray-900">{education?.universityName}</div>
            <div className="text-gray-600">{education?.degree}, {education?.major}</div>
            <div className="text-gray-600">
            {education?.startDate}
              {education?.startDate &&
                (education?.endDate || education?.endDate === "") &&
                " to "}
              {education?.startDate && education?.endDate == ""
                ? "Present"
                : education.endDate}
            </div>
            <div className="text-gray-700 text-sm">
            {education?.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationalPreview;
