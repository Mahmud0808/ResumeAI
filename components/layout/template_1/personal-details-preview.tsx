import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";
import { Mail, Phone, MapPin, Instagram } from "lucide-react"

export default function PersonalDetailsPreview() {
  const { formData } = useFormContext();
  return (
    <div className="text-center space-y-2 mb-8">
      <h1 className="text-4xl font-bold text-[#FF6B6B]">{formData?.firstName} {formData?.lastName}</h1>
      <h2 className="text-xl text-[#FF6B6B]">{formData?.jobTitle}</h2>
      <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4" />
          <span>{formData?.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          <span>{formData?.phone}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{formData?.address}</span>
        </div>
        <div className="flex items-center gap-1">
          <Instagram className="w-4 h-4" />
          <span></span>
        </div>
      </div>
    </div>
  )
}

