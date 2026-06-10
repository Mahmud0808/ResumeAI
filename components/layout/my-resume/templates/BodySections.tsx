"use client";

import React from "react";
import EditableSection from "./EditableSection";
import SummaryPreview from "../previews/SummaryPreview";
import ExperiencePreview from "../previews/ExperiencePreview";
import EducationalPreview from "../previews/EducationalPreview";
import SkillsPreview from "../previews/SkillsPreview";

/**
 * The summary/experience/education/skills blocks, shared across templates.
 * Each is editable (click-to-step) in edit mode and hidden when empty.
 */
const BodySections = ({
  formData,
  isEditMode,
  onSelect,
}: {
  formData: any;
  isEditMode: boolean;
  onSelect: (index: number) => void;
}) => (
  <>
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

    {formData?.skills?.length > 0 && (
      <EditableSection index={5} isEditMode={isEditMode} onSelect={onSelect}>
        <SkillsPreview />
      </EditableSection>
    )}
  </>
);

export default BodySections;
