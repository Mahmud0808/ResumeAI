import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react"
import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

export default function PersonalDetailsPreview() {
  const { formData } = useFormContext();
  return (
    <div className="text-white space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{formData?.firstName} {formData?.lastName}</h1>
        <h2 className="text-2xl">{formData?.jobTitle}</h2>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5" />
          <span>{formData?.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5" />
          <span>{formData?.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <span>{formData?.address}</span>
        </div>
      </div>
    </div>
  )
}

