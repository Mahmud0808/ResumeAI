import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const SkillsPreview = () => {
  const { formData } = useFormContext();
  
  const DotIndicator = ({ level }: { level: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < level ? "" : "bg-gray-200"}`} style={i < level ? { backgroundColor: formData?.themeColor || themeColors[0] } : {}} />
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 
        className="font-semibold text-lg border-b-2 pb-1"
        style={{
          color: formData?.themeColor || themeColors[0],
          borderBottomColor: formData?.themeColor || themeColors[0],
        }}>SKILLS</h3>
        <div className="space-y-3">
        {formData?.skills.map((skill: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{skill.name}</span>
              <DotIndicator level={skill?.rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsPreview;
