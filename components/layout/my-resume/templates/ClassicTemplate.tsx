"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";
import PersonalDetailsPreview from "../previews/PersonalDetailsPreview";

const ClassicTemplate = ({
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
  <div
    className="p-12 shadow-lg border-t-[20px] bg-white w-[210mm] min-h-[297mm] print:shadow-none"
    style={{ borderColor: themeColor }}
  >
    <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
      <PersonalDetailsPreview />
    </EditableSection>
    <BodySections
      formData={formData}
      isEditMode={isEditMode}
      onSelect={onSelect}
    />
  </div>
);

export default ClassicTemplate;
