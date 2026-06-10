import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const SkillsPreview = () => {
  const { formData } = useFormContext();
  const isList = formData?.skillsStyle === "list";

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

      {isList ? (
        // Plain text, comma-separated: cleanly parseable by ATS software.
        // Optional groups render as labeled lines; ungrouped skills follow.
        (() => {
          const groups = new Map<string, string[]>();
          const ungrouped: string[] = [];
          for (const skill of formData?.skills ?? []) {
            if (!skill?.name) continue;
            const group =
              typeof skill?.category === "string" ? skill.category.trim() : "";
            if (group) {
              groups.set(group, [...(groups.get(group) ?? []), skill.name]);
            } else {
              ungrouped.push(skill.name);
            }
          }
          return (
            <div className="my-5 space-y-1.5">
              {[...groups.entries()].map(([group, names]) => (
                <p key={group} className="text-xs break-words leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: formData?.themeColor || themeColors[0] }}
                  >
                    {group}:
                  </span>{" "}
                  {names.join(", ")}
                </p>
              ))}
              {ungrouped.length > 0 && (
                <p className="text-xs break-words leading-relaxed">
                  {groups.size > 0 && (
                    <span
                      className="font-bold"
                      style={{ color: formData?.themeColor || themeColors[0] }}
                    >
                      Other:{" "}
                    </span>
                  )}
                  {ungrouped.join(", ")}
                </p>
              )}
            </div>
          );
        })()
      ) : (
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
      )}
    </div>
  );
};

export default SkillsPreview;
