"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";

const ModernTemplate = ({
  formData,
  themeColor,
  isEditMode,
  onSelect,
}: {
  formData: any;
  themeColor: string;
  isEditMode: boolean;
  onSelect: (index: number) => void;
}) => {
  const contact = [formData?.address, formData?.phone, formData?.email].filter(
    Boolean
  );

  return (
    <div className="shadow-lg bg-white w-[210mm] min-h-[297mm] print:shadow-none overflow-hidden">
      <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
        <div
          className="px-12 py-10 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <h1 className="text-3xl font-bold leading-tight">
            {formData?.firstName} {formData?.lastName}
          </h1>
          {formData?.jobTitle && (
            <p className="text-base font-medium opacity-90">
              {formData.jobTitle}
            </p>
          )}
          {contact.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90">
              {contact.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          )}
        </div>
      </EditableSection>

      <div className="px-12 py-8">
        <BodySections
          formData={formData}
          isEditMode={isEditMode}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default ModernTemplate;
