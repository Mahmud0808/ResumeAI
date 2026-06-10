"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateExperienceDescription } from "@/lib/actions/gemini.actions";
import { addExperienceToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AiLoader, AiThinkingText } from "@/components/common/AiLoader";
import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ExperienceValidationSchema } from "@/lib/validations/resume";
import { experienceFields } from "@/lib/fields";
import { sanitizeNbsp } from "@/lib/utils";

const ExperienceForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsLoadingAi] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState<any[]>(
    []
  );
  const [currentAiIndex, setCurrentAiIndex] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ExperienceValidationSchema>>({
    resolver: zodResolver(ExperienceValidationSchema),
    mode: "onChange",
    defaultValues: {
      experience:
        formData?.experience?.length > 0
          ? formData.experience
          : [
              {
                title: "",
                companyName: "",
                city: "",
                state: "",
                startDate: "",
                endDate: "",
                workSummary: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const handleChange = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    const newEntries = form.getValues("experience").slice();
    newEntries[index] = { ...newEntries[index], [name]: value };
    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const AddNewExperience = () => {
    const newEntry = {
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      workSummary: "",
    };
    append(newEntry);
    const newEntries = [...form.getValues("experience"), newEntry];
    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const RemoveExperience = (index: number) => {
    remove(index);
    const newEntries = form.getValues("experience");
    if (currentAiIndex >= newEntries.length) {
      setCurrentAiIndex(newEntries.length - 1 >= 0 ? newEntries.length - 1 : 0);
    }
    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const generateExperienceDescriptionFromAI = async (index: number) => {
    const experience = form.getValues("experience")[index];
    if (!experience.title || !experience.companyName) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "Please enter the position title and company name to generate summary.",
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    setCurrentAiIndex(index);
    setIsLoadingAi(true);

    const result = await generateExperienceDescription(
      `${experience.title} at ${experience.companyName}`
    );
    setIsLoadingAi(false);

    if (!result.success) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result.error,
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    setAiGeneratedSummaryList(result.data ?? []);

    setTimeout(() => {
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const onSave = async (data: z.infer<typeof ExperienceValidationSchema>) => {
    setIsLoading(true);
    // Store ATS-friendly HTML: no &nbsp; runs from Quill.
    const experience = data.experience.map((entry) => ({
      ...entry,
      workSummary: sanitizeNbsp(entry.workSummary || ""),
    }));
    const result = await addExperienceToResume(params.id, experience);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Professional experience updated successfully.",
        className: "bg-white",
      });
      handleInputChange({
        target: {
          name: "experience",
          value: experience,
        },
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
      <div className="p-5 sm:p-6 shadow-lg shadow-slate-200/60 rounded-xl border border-slate-200/60 border-t-primary-700 border-t-4 bg-white">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          Professional Experience
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add your previous job experiences
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="mt-5">
            <AnimatePresence initial={false}>
            {fields.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 gap-3 border border-slate-200/80 p-3 sm:p-4 my-5 rounded-xl bg-slate-50/50"
              >
                {experienceFields.map((config) => (
                  <FormField
                    key={config.name}
                    control={form.control}
                    name={`experience.${index}.${config.name}`}
                    render={({ field }) => (
                      <FormItem className={config.colSpan || ""}>
                        {config.type === "richText" ? (
                          <div className="flex justify-between items-end">
                            <FormLabel className="text-slate-700 font-semibold text-md">
                              {config.label}:
                            </FormLabel>
                            <Button
                              variant="outline"
                              onClick={() =>
                                generateExperienceDescriptionFromAI(index)
                              }
                              type="button"
                              size="sm"
                              className="border-primary text-primary flex gap-2"
                              disabled={isAiLoading}
                            >
                              {isAiLoading && currentAiIndex === index ? (
                                <>
                                  <AiLoader size={16} />
                                  <AiThinkingText />
                                </>
                              ) : (
                                <>
                                  <Brain className="h-4 w-4" /> Generate from
                                  AI
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <FormLabel className="text-slate-700 font-semibold text-md">
                            {config.label}:
                          </FormLabel>
                        )}
                        <FormControl>
                          {config.type === "richText" ? (
                            <RichTextEditor
                              defaultValue={(field.value as string) || ""}
                              onRichTextEditorChange={(e) => {
                                field.onChange(e);
                                handleChange(index, e);
                              }}
                            />
                          ) : (
                            <Input
                              type={config.type}
                              {...field}
                              value={field.value as string}
                              className={`no-focus ${
                                form.formState.errors.experience?.[index]?.[
                                  config.name
                                ]
                                  ? "error"
                                  : ""
                              }`}
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(index, e);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </motion.div>
            ))}
            </AnimatePresence>
            <div className="mt-3 flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={AddNewExperience}
                  className="text-primary"
                  type="button"
                >
                  <Plus className="size-4 mr-2" /> Add More
                </Button>
                <Button
                  variant="outline"
                  onClick={() => RemoveExperience(fields.length - 1)}
                  className="text-primary"
                  type="button"
                >
                  <Minus className="size-4 mr-2" /> Remove
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="bg-primary-700 hover:bg-primary-800 text-white"
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
        </Form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="my-5"
          ref={listRef}
        >
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummaryList?.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.01, y: -2 }}
              onClick={() => {
                form.setValue(
                  `experience.${currentAiIndex}.workSummary`,
                  item?.description,
                  { shouldValidate: true }
                );
                handleInputChange({
                  target: {
                    name: "experience",
                    value: form.getValues("experience"),
                  },
                });
              }}
              className={`p-5 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-primary-700/10 transition-shadow my-4 rounded-xl border border-slate-200/60 border-t-2 border-t-primary-500 bg-white ${
                isAiLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-disabled={isAiLoading}
            >
              <h2 className="font-semibold my-1 text-primary text-gray-800">
                Level: {item?.activity_level}
              </h2>
              <p className="text-justify text-gray-600">{item?.description}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ExperienceForm;
