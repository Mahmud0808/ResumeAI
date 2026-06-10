"use client";

import React from "react";
import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import SidebarTemplate from "./templates/SidebarTemplate";

const TEMPLATES: Record<string, React.ComponentType<any>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  minimal: MinimalTemplate,
  sidebar: SidebarTemplate,
};

const ResumePreview = () => {
  const { formData, setActiveFormIndex } = useFormContext();
  const pathname = usePathname();

  const isEditMode = pathname.endsWith("/edit");
  const themeColor = formData?.themeColor || themeColors[0];
  const Template = TEMPLATES[formData?.template] || ClassicTemplate;

  if (Object.keys(formData || {}).length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-[210mm] min-h-[297mm] rounded-sm shadow-lg skeleton" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Template
        formData={formData}
        themeColor={themeColor}
        isEditMode={isEditMode}
        onSelect={setActiveFormIndex}
      />
    </div>
  );
};

export default ResumePreview;
