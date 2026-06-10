"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";

const SidebarTemplate = ({
  formData,
  themeColor,
  isEditMode,
  onSelect,
}: {
  formData: any;
  themeColor: string;
  isEditMode: boolean;
  onSelect: (index: number) => void;
}) => (
  <div className="flex w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none overflow-hidden">
    {/* Left sidebar: identity + contact + skills */}
    <div
      className="w-[34%] p-8 text-white"
      style={{ backgroundColor: themeColor }}
    >
      <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
        <h1 className="text-2xl font-bold leading-tight">
          {formData?.firstName} {formData?.lastName}
        </h1>
        {formData?.jobTitle && (
          <p className="mb-4 text-sm opacity-90">{formData.jobTitle}</p>
        )}
        <div className="space-y-1 break-words text-xs opacity-90">
          {formData?.address && <p>{formData.address}</p>}
          {formData?.phone && <p>{formData.phone}</p>}
          {formData?.email && <p>{formData.email}</p>}
        </div>
      </EditableSection>

      {formData?.skills?.length > 0 &&
        !formData?.hiddenSections?.includes("skills") && (
        <EditableSection index={5} isEditMode={isEditMode} onSelect={onSelect}>
          <h2 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide">
            Skill{formData.skills.length > 1 ? "s" : ""}
          </h2>
          {formData?.skillsStyle === "list" ? (
            (() => {
              const groups = new Map<string, string[]>();
              const ungrouped: string[] = [];
              for (const skill of formData.skills) {
                if (!skill?.name) continue;
                const group =
                  typeof skill?.category === "string"
                    ? skill.category.trim()
                    : "";
                if (group) {
                  groups.set(group, [...(groups.get(group) ?? []), skill.name]);
                } else {
                  ungrouped.push(skill.name);
                }
              }
              return (
                <div className="space-y-1.5">
                  {[...groups.entries()].map(([group, names]) => (
                    <p key={group} className="break-words text-xs leading-relaxed">
                      <span className="font-bold">{group}:</span>{" "}
                      {names.join(", ")}
                    </p>
                  ))}
                  {ungrouped.length > 0 && (
                    <p className="break-words text-xs leading-relaxed">
                      {groups.size > 0 && (
                        <span className="font-bold">Other: </span>
                      )}
                      {ungrouped.join(", ")}
                    </p>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="space-y-2">
              {formData.skills.map((skill: any, index: number) => (
                <div key={index}>
                  <p className="mb-1 text-xs">{skill?.name}</p>
                  <div className="h-1.5 w-full rounded-full bg-white/30">
                    <div
                      className="h-1.5 rounded-full bg-white"
                      style={{ width: (skill?.rating || 1) * 20 + "%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </EditableSection>
      )}
    </div>

    {/* Main column: summary + reorderable experience/education/custom
        sections (skills stay pinned in the sidebar) */}
    <div className="w-[66%] p-8">
      <BodySections
        formData={formData}
        isEditMode={isEditMode}
        onSelect={onSelect}
        sections={["experience", "education", "custom"]}
      />
    </div>
  </div>
);

export default SidebarTemplate;
