import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

export default function SummaryPreview() {
  const { formData } = useFormContext();
  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-3 bg-[rgba(255,255,255,0.1)] p-2 flex items-center gap-2">
        <span className="font-bold">PROFILE</span>
      </h3>
      <p className="text-xs leading-relaxed">
      {formData?.summary}
      </p>
    </div>
  )
}

