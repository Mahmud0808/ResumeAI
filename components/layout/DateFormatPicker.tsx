"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check } from "lucide-react";
import { resumeDateFormats } from "@/lib/utils";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";

const DateFormatPicker = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { formData, handleInputChange } = useFormContext();
  const selected = formData?.dateFormat || "default";

  const onSelect = async (formatId: string) => {
    if (formatId === selected) {
      return;
    }

    handleInputChange({ target: { name: "dateFormat", value: formatId } });

    const result = await updateResume({
      resumeId: params.id,
      updates: { dateFormat: formatId },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Date format updated automatically.",
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
          <CalendarDays /> Dates
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-3 text-sm font-bold">Select Date Format</h2>
        <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1">
          {resumeDateFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => onSelect(format.id)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] ${
                selected === format.id
                  ? "border-primary-700 bg-primary-50/50 shadow-sm"
                  : "border-slate-200"
              }`}
            >
              <span className="flex flex-col">
                <span className="font-medium text-slate-700">
                  {format.name}
                </span>
                <span className="text-xs text-slate-400">{format.example}</span>
              </span>
              {selected === format.id && (
                <Check className="h-4 w-4 text-primary-700" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFormatPicker;
