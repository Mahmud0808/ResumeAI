"use client";

import React from "react";
import EditableSection from "./EditableSection";
import SummaryPreview from "../previews/SummaryPreview";
import ExperiencePreview from "../previews/ExperiencePreview";
import EducationalPreview from "../previews/EducationalPreview";

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

      {formData?.skills?.length > 0 && (
        <EditableSection index={5} isEditMode={isEditMode} onSelect={onSelect}>
          <h2 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide">
            Skill{formData.skills.length > 1 ? "s" : ""}
          </h2>
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
        </EditableSection>
      )}
    </div>

    {/* Main column: summary + experience + education */}
    <div className="w-[66%] p-8">
      <EditableSection index={2} isEditMode={isEditMode} onSelect={onSelect}>
        <SummaryPreview />
      </EditableSection>

      {formData?.experience?.length > 0 && (
        <EditableSection index={3} isEditMode={isEditMode} onSelect={onSelect}>
          <ExperiencePreview />
        </EditableSection>
      )}

      {formData?.education?.length > 0 && (
        <EditableSection index={4} isEditMode={isEditMode} onSelect={onSelect}>
          <EducationalPreview />
        </EditableSection>
      )}
    </div>
  </div>
);

export default SidebarTemplate;
