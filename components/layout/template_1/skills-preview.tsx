import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

export default function SkillsPreview() {
  const { formData } = useFormContext();
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-[#FF6B6B] mb-3 border-b-2 border-[#FF6B6B] pb-1">Skills</h3>
        <div className="flex gap-2 flex-wrap">
        {formData?.skills.map((skill: any, index: number) => (
          <div
            key={index}
            className="bg-[#FF6B6B] text-white px-3 py-1 rounded-md text-sm"
          >
            <h2 className="text-xs">{skill.name}</h2>
            <div className="h-2 bg-gray-200 w-full rounded-full col-span-2">
              <div
                className="h-2 rounded-full"
                style={{
                  backgroundColor: formData?.themeColor || themeColors[0],
                  width: (skill?.rating || 1) * 20 + "%",
                }}>
            </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

