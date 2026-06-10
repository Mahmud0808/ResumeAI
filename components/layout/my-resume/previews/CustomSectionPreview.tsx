import { useFormContext } from "@/lib/context/FormProvider";
import { sanitizeNbsp, themeColors } from "@/lib/utils";
import React from "react";

const CustomSectionPreview = ({ index }: { index: number }) => {
  const { formData } = useFormContext();
  const section = formData?.customSections?.[index];

  if (!section?.title || !section?.body) {
    return null;
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        {section.title}
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />
      <div
        className="text-xs text-justify my-2 break-words form-preview"
        dangerouslySetInnerHTML={{ __html: sanitizeNbsp(section.body) }}
      />
    </div>
  );
};

export default CustomSectionPreview;
