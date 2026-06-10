"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, LayoutTemplate } from "lucide-react";
import { resumeTemplates, themeColors } from "@/lib/utils";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";

const TemplatePicker = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { formData, handleInputChange } = useFormContext();
  const selected = formData?.template || "classic";
  const themeColor = formData?.themeColor || themeColors[0];

  const onSelect = async (templateId: string) => {
    handleInputChange({ target: { name: "template", value: templateId } });

    const result = await updateResume({
      resumeId: params.id,
      updates: { template: templateId },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Template updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex gap-2 border-primary-700 text-primary-700 hover:bg-primary-700/10"
        >
          <LayoutTemplate /> Template
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-3 text-sm font-bold">Select Template</h2>
        <div className="flex flex-col gap-2">
          {resumeTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] ${
                selected === template.id
                  ? "border-primary-700 bg-primary-50/50 shadow-sm"
                  : "border-slate-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-sm"
                  style={{ backgroundColor: themeColor }}
                />
                {template.name}
              </span>
              {selected === template.id && (
                <Check className="h-4 w-4 text-primary-700" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplatePicker;
