import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const ExperiencePreview = () => {
  const { formData } = useFormContext();

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Professional Experience
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.experience?.map((experience: any, index: number) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName}
            {experience?.companyName && experience?.city && ", "}
            {experience?.city}
            {experience?.city && experience?.state && ", "}
            {experience?.state}
            <span>
              {experience?.startDate}
              {experience?.startDate &&
                (experience?.endDate || experience?.endDate === "") &&
                " to "}
              {experience?.startDate && experience?.endDate == ""
                ? "Present"
                : experience.endDate}
            </span>
          </h2>
          {experience?.workSummary && (
            <div
              className="text-xs text-justify my-2 form-preview"
              dangerouslySetInnerHTML={{
                __html: experience?.workSummary,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;
