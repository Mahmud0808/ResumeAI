import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import { Github } from "lucide-react"; // Import GitHub icon
import React from "react";

const ProjectsPreview = () => {
  const { formData } = useFormContext();
  console.log(formData);

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Projects
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.projects?.map((project: any, index: number) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {project?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {project?.companyName}
            <span>
              {project?.startDate}
              {project?.startDate &&
                (project?.endDate || project?.endDate === "") &&
                " to "}
              {project?.startDate && project?.endDate === ""
                ? "Present"
                : project.endDate}
            </span>
          </h2>

          {/* GitHub Repo Link (Only if available) */}
          {project?.githubRepo && (
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              <Github size={14} className="inline-block" /> {/* GitHub Icon */}
              {project.githubRepo}
            </a>
          )}

          {/* Work Summary */}
          {project?.workSummary && (
            <div
              className="text-xs my-2 form-preview"
              dangerouslySetInnerHTML={{
                __html: project?.workSummary,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsPreview;
