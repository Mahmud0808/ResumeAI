import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

function PersonalDetailsPreview() {
  const { formData } = useFormContext();
  
  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        {formData?.firstName} {formData?.lastName}
      </h2>

      <h2 className="text-center text-sm font-medium">
        {formData?.jobTitle}
      </h2>

      <h2
        className="text-center font-normal text-xs"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        {formData?.address}
      </h2>

      <div className="flex justify-between">
        <h2
          className="font-normal text-xs"
          style={{
            color: formData?.themeColor || themeColors[0],
          }}
        >
          {formData?.phone}
        </h2>

        <h2
          className="font-normal text-xs"
          style={{
            color: formData?.themeColor || themeColors[0],
          }}
        >
          {formData?.email}
        </h2>
      </div>
      
      <hr
        className="border-[1.5px] my-2 mb-5"
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />
    </div>
  );
}

export default PersonalDetailsPreview;
