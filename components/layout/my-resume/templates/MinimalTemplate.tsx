"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";

const MinimalTemplate = ({
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
    <div className="p-12 shadow-lg bg-white w-[210mm] min-h-[297mm] print:shadow-none">
      <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
        <div className="mb-4">
          <h1 className="text-3xl font-light uppercase tracking-wide text-gray-900">
            {formData?.firstName} {formData?.lastName}
          </h1>
          {formData?.jobTitle && (
            <p className="mt-1 text-sm uppercase tracking-widest text-gray-500">
              {formData.jobTitle}
            </p>
          )}
          <div
            className="my-3 h-[2px] w-16"
            style={{ backgroundColor: themeColor }}
          />
          {contact.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
              {contact.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="opacity-50">•</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </EditableSection>

      <BodySections
        formData={formData}
        isEditMode={isEditMode}
        onSelect={onSelect}
      />
    </div>
  );
};

export default MinimalTemplate;
