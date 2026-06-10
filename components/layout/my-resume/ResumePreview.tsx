"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import SidebarTemplate from "./templates/SidebarTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import CompactTemplate from "./templates/CompactTemplate";
import BoldTemplate from "./templates/BoldTemplate";

const TEMPLATES: Record<string, React.ComponentType<any>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  minimal: MinimalTemplate,
  sidebar: SidebarTemplate,
  executive: ExecutiveTemplate,
  compact: CompactTemplate,
  bold: BoldTemplate,
};

// A4 in CSS pixels at 96dpi (210mm x 297mm).
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const ResumePreview = () => {
  const { formData, setActiveFormIndex } = useFormContext();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(A4_HEIGHT_PX);

  const isEditMode = pathname.endsWith("/edit");
  const themeColor = formData?.themeColor || themeColors[0];
  const Template = TEMPLATES[formData?.template] || ClassicTemplate;
  const hasData = Object.keys(formData || {}).length > 0;

  // Fit the fixed-width A4 sheet to the available column: scale down on
  // narrow screens instead of overflowing horizontally. Print uses the
  // unscaled sheet (see globals.css overrides).
  useEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return;

    const update = () => {
      const width = container.clientWidth;
      if (width > 0) {
        setScale(Math.min(1, width / A4_WIDTH_PX));
      }
      // offsetHeight ignores the transform, so this is the unscaled height.
      setSheetHeight(sheet.offsetHeight || A4_HEIGHT_PX);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [hasData, formData?.template]);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[210mm] min-h-[50vh] rounded-sm shadow-lg skeleton" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="resume-scale-outer relative mx-auto"
        style={{
          width: A4_WIDTH_PX * scale,
          height: sheetHeight * scale,
        }}
      >
        <div
          ref={sheetRef}
          className="resume-scale-inner absolute left-0 top-0 origin-top-left"
          style={{ width: A4_WIDTH_PX, transform: `scale(${scale})` }}
        >
          <Template
            formData={formData}
            themeColor={themeColor}
            isEditMode={isEditMode}
            onSelect={setActiveFormIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
