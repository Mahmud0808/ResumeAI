import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import { Github } from "lucide-react"; // Import GitHub icon
import React from "react";

export default function ProjectsPreview() {
  const { formData } = useFormContext();
  // This section wasn't in the original template but adding it for completeness
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 bg-gray-100 p-2 flex items-center gap-2">
        <span>PROJECTS</span>
      </h3>
      <div className="space-y-6">
      {formData?.projects?.map((project: any, index: number) => (
          <div key={index} className="space-y-2">
            <div>
              <h4 className="font-bold">{project?.title}</h4>
              <p className="text-gray-600">{project?.companyName}</p>
              <p className="text-sm text-gray-500">
                {project?.startDate}
                {project?.startDate &&
                  (project?.endDate || project?.endDate === "") &&
                  " to "}
                {project?.startDate && project?.endDate == ""
                  ? "Present"
                  : project.endDate}
              </p>
            </div>
            <div className="list-disc pl-4 space-y-1 text-xs">
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
    </div>
  )
}

