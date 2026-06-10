"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";

const ElegantTemplate = ({
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
    <div
      className="shadow-lg bg-white w-[210mm] min-h-[297mm] print:shadow-none border-l-[12px]"
      style={{ borderColor: themeColor }}
    >
      <div className="p-12">
        <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
          <div
            className="border-b-2 pb-4 mb-2"
            style={{ borderColor: themeColor }}
          >
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: themeColor }}
            >
              {formData?.firstName} {formData?.lastName}
            </h1>
            {formData?.jobTitle && (
              <p className="mt-1 text-lg text-gray-600">{formData.jobTitle}</p>
            )}
            {contact.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
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
    </div>
  );
};

export default ElegantTemplate;
