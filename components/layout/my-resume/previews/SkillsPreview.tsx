import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const SkillsPreview = () => {
  const { formData } = useFormContext();

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Skill{formData?.skills.length > 1 ? "s" : ""}
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      <div className="grid grid-cols-2 gap-x-16 max-sm:gap-x-6 max-md:gap-x-10 gap-y-3 my-5">
        {formData?.skills.map((skill: any, index: number) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center justify-between gap-3"
          >
            <h2 className="text-xs">{skill.name}</h2>
            <div className="h-2 bg-gray-200 w-full rounded-full col-span-2">
              <div
                className="h-2 rounded-full"
                style={{
                  backgroundColor: formData?.themeColor || themeColors[0],
                  width: (skill?.rating || 1) * 20 + "%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPreview;
