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
      <h3 
      className="text-xl font-semibold"
      style={{
        color: formData?.themeColor || themeColors[0],
        marginBottom: "0.75rem", // mb-3 -> 12px (3 * 4px)
        borderBottom: "2px solid",
        borderColor: formData?.themeColor || themeColors[0],
        paddingBottom: "0.25rem", // pb-1 -> 4px (1 * 4px)
        }}>Projects</h3>
      {formData?.projects?.map((project: any, index: number) => (
        <div className="mb-8">
          <h2 className="text-l font-semibold">{project?.title} {project?.companyName}</h2>
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

