import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import { Github } from "lucide-react"; // Import GitHub icon
import React from "react";

export default function ProjectsPreview() {
  const { formData } = useFormContext();
  console.log(formData)
  // This section wasn't in the original template but adding it for completeness
  return (
    <div className="my-6">
      {formData?.projects?.map((project: any, index: number) => (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#FF6B6B] mb-3 border-b-2 border-[#FF6B6B] pb-1">{project?.title} {project?.companyName}</h3>
          <div className="text-gray-600 italic">
            {project?.projectSummary && (
              <div
                className="text-xs my-2 form-preview"
                dangerouslySetInnerHTML={{
                  __html: project?.projectSummary,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

