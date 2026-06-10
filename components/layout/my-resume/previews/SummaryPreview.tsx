import { useFormContext } from "@/lib/context/FormProvider";
import React from "react";

const SummaryPreview = () => {
  const { formData } = useFormContext();

  return <p className="text-xs text-justify break-words">{formData?.summary}</p>;
};

export default SummaryPreview;
