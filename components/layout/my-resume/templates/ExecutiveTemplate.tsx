"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";

const ExecutiveTemplate = ({
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
    <div className="p-12 shadow-lg bg-white w-[210mm] min-h-[297mm] print:shadow-none font-serif">
      <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-4 h-[3px] w-full border-b pb-[2px]"
            style={{ borderColor: themeColor, backgroundColor: themeColor }}
          />
          <h1 className="text-4xl font-bold tracking-wide text-gray-900">
            {formData?.firstName} {formData?.lastName}
          </h1>
          {formData?.jobTitle && (
            <p
              className="mt-1 text-base uppercase tracking-[0.25em]"
              style={{ color: themeColor }}
            >
              {formData.jobTitle}
            </p>
          )}
          {contact.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-xs text-gray-500">
              {contact.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="opacity-50">|</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}
          <div
            className="mx-auto mt-4 h-[3px] w-full border-t pt-[2px]"
            style={{ borderColor: themeColor, backgroundColor: themeColor }}
          />
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

export default ExecutiveTemplate;
