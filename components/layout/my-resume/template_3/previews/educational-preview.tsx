import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";

export default function EducationalPreview() {
  const { formData } = useFormContext();
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 bg-gray-100 p-2 flex items-center gap-2">
        <span>EDUCATION</span>
      </h3>
      <div className="space-y-4">
        {formData?.education?.map((education: any, index: number) => (
          <div key={index} className="space-y-2">
            <div>
              <h4 className="font-bold">{education?.universityName}</h4>
              <p className="text-gray-600">
              {education?.degree}
              {education?.degree && education?.major && " in "}
              {education?.major}
              </p>
              <p className="text-sm text-gray-500">
                {education?.startDate}
                {education?.startDate &&
                  (education?.endDate || education?.endDate === "") &&
                  " to "}
                {education?.startDate && education?.endDate == ""
                  ? "Present"
                  : education.endDate}
              </p>
            </div>
            <div className="list-disc pl-4 space-y-1 text-xs">
                {education?.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

