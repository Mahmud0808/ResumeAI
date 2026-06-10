"use client";

import React from "react";
import EditableSection from "./EditableSection";
import BodySections from "./BodySections";

const CompactTemplate = ({
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
      className="shadow-lg bg-white w-[210mm] min-h-[297mm] print:shadow-none border-t-8"
      style={{ borderColor: themeColor }}
    >
      <div className="p-10">
        <EditableSection index={1} isEditMode={isEditMode} onSelect={onSelect}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">
                {formData?.firstName} {formData?.lastName}
              </h1>
              {formData?.jobTitle && (
                <p
                  className="mt-0.5 text-sm font-semibold"
                  style={{ color: themeColor }}
                >
                  {formData.jobTitle}
                </p>
              )}
            </div>
            {contact.length > 0 && (
              <div className="text-right text-xs leading-5 text-gray-500">
                {contact.map((item, index) => (
                  <p key={index}>{item}</p>
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

export default CompactTemplate;
