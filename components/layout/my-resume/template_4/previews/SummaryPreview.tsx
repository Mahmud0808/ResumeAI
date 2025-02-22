import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const SummaryPreview = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 
      className="font-semibold text-lg border-b-2 pb-1 "
      style={{
        color: formData?.themeColor || themeColors[0],
        borderBottomColor: formData?.themeColor || themeColors[0],
      }}>PROFILE</h3>
      <div className="space-y-4 text-gray-700">
        <p>
          {formData?.summary}
        </p>
      </div>
    </div>
  );
};

export default SummaryPreview;
