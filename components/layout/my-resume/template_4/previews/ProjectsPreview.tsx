import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import { Github } from "lucide-react"; // Import GitHub icon
import React from "react";

const ProjectsPreview = () => {
  const { formData } = useFormContext();
  console.log(formData)
  return (
    <div className="space-y-4">
      <h3 
      className="font-semibold text-lg border-b-2 pb-1"
      style={{
        color: formData?.themeColor || themeColors[0],
        borderBottomColor: formData?.themeColor || themeColors[0],
      }}>PROJECTS</h3>
      <div className="space-y-6">
        {formData?.projects?.map((project: any, index: number) => (
          <div key={index} className="space-y-1">
            <div className="font-semibold text-gray-900">{project?.title}</div>
            <div className="text-gray-600">{project?.companyName}</div>
            <div className="text-gray-600">
            {project?.startDate}
              {project?.startDate &&
                (project?.endDate || project?.endDate === "") &&
                " to "}
              {project?.startDate && project?.endDate == ""
                ? "Present"
                : project.endDate}
            </div>
            <div className="text-gray-700 text-sm">
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
  );
};

export default ProjectsPreview;
