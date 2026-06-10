"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ListChecks } from "lucide-react";
import { hideableSections } from "@/lib/utils";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";

const SectionVisibility = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { formData, handleInputChange } = useFormContext();
  const hidden: string[] = Array.isArray(formData?.hiddenSections)
    ? formData.hiddenSections
    : [];

  const onToggle = async (sectionId: string) => {
    const next = hidden.includes(sectionId)
      ? hidden.filter((id) => id !== sectionId)
      : [...hidden, sectionId];

    handleInputChange({ target: { name: "hiddenSections", value: next } });

    const result = await updateResume({
      resumeId: params.id,
      updates: { hiddenSections: next },
    });

    if (!result.success) {
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
          <ListChecks /> Sections
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-1 text-sm font-bold">Resume Sections</h2>
        <p className="mb-3 text-xs text-slate-500">
          Hidden sections keep their data — they're just left off the resume.
        </p>
        <div className="flex flex-col gap-1.5">
          {hideableSections.map((section) => {
            const isVisible = !hidden.includes(section.id);
            return (
              <button
                key={section.id}
                onClick={() => onToggle(section.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] ${
                  isVisible
                    ? "border-slate-200 text-slate-700"
                    : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                <span className={isVisible ? "" : "line-through"}>
                  {section.name}
                </span>
                {isVisible ? (
                  <Eye className="h-4 w-4 text-primary-700" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SectionVisibility;
