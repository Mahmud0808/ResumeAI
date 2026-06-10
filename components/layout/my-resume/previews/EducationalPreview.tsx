import { useFormContext } from "@/lib/context/FormProvider";
import { formatResumeDate, themeColors } from "@/lib/utils";
import React from "react";

const EducationalPreview = () => {
  const { formData } = useFormContext();

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Education
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.education.map((education: any, index: number) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {education.universityName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree}
            {education?.degree && education?.major && " in "}
            {education?.major}
            <span>
              {formatResumeDate(education?.startDate, formData?.dateFormat)}
              {education?.startDate &&
                (education?.endDate || education?.endDate === "") &&
                " to "}
              {education?.startDate && education?.endDate == ""
                ? "Present"
                : formatResumeDate(education?.endDate, formData?.dateFormat)}
            </span>
          </h2>
          {education?.description && (
            <p className="text-xs my-2 text-justify break-words">{education?.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationalPreview;
