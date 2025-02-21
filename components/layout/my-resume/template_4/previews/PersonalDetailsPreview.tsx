import { useFormContext } from "@/lib/context/FormProvider";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react"
import { themeColors } from "@/lib/utils";
import React from "react";

function PersonalDetailsPreview() {
  const { formData } = useFormContext();
  
  return (
    <div 
    className="text-white px-8 py-12 text-center space-y-6"
    style={{
      backgroundColor: formData?.themeColor || themeColors[0],
    }}>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{formData?.firstName} {formData?.lastName}</h1>
        <h2 className="text-2xl">{formData?.jobTitle}</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{formData?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{formData?.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{formData?.address}</span>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetailsPreview;
