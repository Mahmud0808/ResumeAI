import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";

export default function EducationalPreview() {
  const { formData } = useFormContext();
  return (
    <div className="mb-8">
      <h3 
      className="text-xl font-semibold"
      style={{
        color: formData?.themeColor || themeColors[0],
        marginBottom: "0.75rem", // mb-3 -> 12px (3 * 4px)
        borderBottom: "2px solid",
        borderColor: formData?.themeColor || themeColors[0],
        paddingBottom: "0.25rem", // pb-1 -> 4px (1 * 4px)
      }}>Education</h3>
      {formData?.education.map((education: any, index: number) => (
        <div className="grid grid-cols-[1fr,2fr] gap-4">
          <div>
            <div className="text-gray-600">{education.universityName}</div>
          </div>
          <div>
            <div className="font-semibold">
              {education?.degree}
              {education?.degree && education?.major && " in "}
              {education?.major}
            </div>
            <div className="italic text-sm">
              {education?.startDate}
              {education?.startDate &&
                (education?.endDate || education?.endDate === "") &&
                " to "}
              {education?.startDate && education?.endDate == ""
                ? "Present"
                : education.endDate}
                </div>
            <div className="text-gray-500 mt-1 text-sm">{education?.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

