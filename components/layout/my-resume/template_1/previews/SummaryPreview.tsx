import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

export default function SummaryPreview() {
  const { formData } = useFormContext();
  return (
    <div className="mb-8">
      <h3 
      className="text-xl font-semibold"
      style={{
              color: formData?.themeColor || themeColors[0],
              marginBottom: "0.75rem", // mb-3 -> 12px (3 * 4px)
              borderBottom: "2px solid",
              borderColor: formData?.themeColor || themeColors[0],
              paddingBottom: "0.25rem", // pb-1 -> 4px (1 * 4px)
            }}>Profile</h3>
      <p className="text-gray-700 text-sm">
        {formData?.summary}
      </p>
    </div>
  )
}

