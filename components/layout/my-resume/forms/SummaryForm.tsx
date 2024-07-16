"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateSummary } from "@/lib/actions/gemini.actions";
import { updateResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";

const SummaryForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [summary, setSummary] = useState(formData?.summary || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState(
    [] as any
  );
  const { toast } = useToast();

  const handleSummaryChange = (e: any) => {
    const newSummary = e.target.value;
    setSummary(newSummary);

    handleInputChange({
      target: {
        name: "summary",
        value: newSummary,
      },
    });
  };

  const generateSummaryFromAI = async () => {
    setIsAiLoading(true);

    const result = await generateSummary(formData?.jobTitle);

    setAiGeneratedSummaryList(result);

    setIsAiLoading(false);

    setTimeout(function () {
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const updates = {
      summary: formData?.summary,
    };

    const result = await updateResume({
      resumeId: params.id,
      updates: updates,
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Summary updated successfully.",
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

    setIsLoading(false);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-white">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          Summary
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add summary about your job
        </p>

        <form className="mt-5 space-y-2" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label className=" text-slate-700 font-semibold">Summary:</label>
            <Button
              variant="outline"
              onClick={() => {
                generateSummaryFromAI();
              }}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={isAiLoading}
            >
              {isAiLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}{" "}
              Generate from AI
            </Button>
          </div>
          <Textarea
            className="no-focus min-h-[10em]"
            required
            value={summary}
            onChange={handleSummaryChange}
            defaultValue={formData?.summary || ""}
          />
          <div className="flex justify-end">
            <Button
              className="mt-3 bg-primary-700 hover:bg-primary-800 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className="my-5" ref={listRef}>
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummaryList?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() =>
                handleSummaryChange({
                  target: { name: "summary", value: item?.summary },
                })
              }
              className={`p-5 shadow-lg my-4 rounded-lg border-t-2 ${
                isAiLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-disabled={isAiLoading}
            >
              <h2 className="font-semibold my-1 text-primary text-gray-800">
                Level: {item?.experience_level}
              </h2>
              <p className="text-justify text-gray-600">{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryForm;
