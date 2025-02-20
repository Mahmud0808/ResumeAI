import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

export default function SkillsPreview() {
  const { formData } = useFormContext();
  return (
    <div className="space-y-8 text-white">
      <div>
        <h3 className="text-lg font-semibold mb-3 bg-[rgba(255,255,255,0.1)] p-2">SKILLS</h3>
        <div className="space-y-2">
          {formData?.skills.map((skill: any, index: number) => (
            <div key={index} className="space-y-1">
              <div>{skill.name}</div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < skill?.rating ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

