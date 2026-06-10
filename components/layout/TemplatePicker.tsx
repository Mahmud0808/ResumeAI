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
import TemplateGlyph from "@/components/layout/TemplateGlyph";

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
          className="flex gap-2 border-primary-700 text-primary-700 hover:border-primary-700 hover:bg-primary-50 hover:text-primary-800 hover:shadow-md hover:shadow-primary-700/15"
        >
          <LayoutTemplate /> Template
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <h2 className="mb-3 text-sm font-bold">Select Template</h2>
        <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {resumeTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-[0.97] ${
                selected === template.id
                  ? "border-primary-700 bg-primary-50/50 shadow-sm ring-1 ring-primary-700/30"
                  : "border-slate-200"
              }`}
            >
              <TemplateGlyph
                template={template.id}
                color={themeColor}
                className="w-full transition-transform duration-200 group-hover:scale-[1.03]"
              />
              <span className="text-xs font-medium text-slate-700">
                {template.name}
              </span>
              {selected === template.id && (
                <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 shadow-sm">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplatePicker;
