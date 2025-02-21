import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

export default function SkillsPreview() {
  const { formData } = useFormContext();
  return (
    <div className="space-y-8">
      <div>
        <h3 
        className="text-xl font-semibold"
        style={{
          color: formData?.themeColor || themeColors[0],
          marginBottom: "0.75rem", // mb-3 -> 12px (3 * 4px)
          borderBottom: "2px solid",
          borderColor: formData?.themeColor || themeColors[0],
          paddingBottom: "0.25rem", // pb-1 -> 4px (1 * 4px)
        }}>Skills</h3>
        <div className="flex gap-2 flex-wrap">
        {formData?.skills.map((skill: any, index: number) => (
          <div
            key={index}
            className="px-3 py-1 rounded-md text-sm"
            style={{
              backgroundColor : "white",
              color : formData?.themeColor || themeColors[0],
              border : "1px solid",
            }}
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

