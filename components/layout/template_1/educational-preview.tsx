import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";

export default function EducationalPreview() {
  const { formData } = useFormContext();
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-[#FF6B6B] mb-3 border-b-2 border-[#FF6B6B] pb-1">Education</h3>
      {formData?.education.map((education: any, index: number) => (
        <div className="grid grid-cols-[1fr,2fr] gap-4">
          <div>
            <div className="text-[#FF6B6B]">
            {education?.startDate}
              {education?.startDate &&
                (education?.endDate || education?.endDate === "") &&
                " to "}
              {education?.startDate && education?.endDate == ""
                ? "Present"
                : education.endDate}
            </div>
            <div className="text-gray-600">{education.universityName}</div>
          </div>
          <div>
            <div className="font-semibold">
              {education?.degree}
              {education?.degree && education?.major && " in "}
              {education?.major}
            </div>
            <div className="italic">University of Wisconsin</div>
          </div>
          {education?.description && (
            <div className="text-gray-700 mt-1">{education?.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}

