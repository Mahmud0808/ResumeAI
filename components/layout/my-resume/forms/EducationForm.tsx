"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateEducationDescription } from "@/lib/actions/gemini.actions";
import { addEducationToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { educationFields } from "@/lib/fields";
import { EducationValidationSchema } from "@/lib/validations/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Loader2, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AiLoader, AiThinkingText } from "@/components/common/AiLoader";
import React, { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const EducationForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedDescriptionList, setAiGeneratedDescriptionList] = useState<
    any[]
  >([]);
  const [currentAiIndex, setCurrentAiIndex] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof EducationValidationSchema>>({
    resolver: zodResolver(EducationValidationSchema),
    mode: "onChange",
    defaultValues: {
      education:
        formData?.education?.length > 0
          ? formData.education
          : [
              {
                universityName: "",
                degree: "",
                major: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const handleChange = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    const newEntries = form.getValues("education").slice();
    newEntries[index] = { ...newEntries[index], [name]: value };
    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const AddNewEducation = () => {
    const newEntry = {
      universityName: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    append(newEntry);
    const newEntries = [...form.getValues("education"), newEntry];
    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const RemoveEducation = (index: number) => {
    remove(index);
    const newEntries = form.getValues("education");
    if (currentAiIndex >= newEntries.length) {
      setCurrentAiIndex(newEntries.length - 1 >= 0 ? newEntries.length - 1 : 0);
    }
    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const generateEducationDescriptionFromAI = async (index: number) => {
    const education = form.getValues("education")[index];
    if (!education.universityName || !education.degree || !education.major) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "Please enter the name of institute, degree and major to generate description.",
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    setCurrentAiIndex(index);
    setIsAiLoading(true);

    const result = await generateEducationDescription(
      `${education.universityName} on ${education.degree} in ${education.major}`
    );

    setIsAiLoading(false);

    if (!result.success) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result.error,
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    setAiGeneratedDescriptionList(result.data ?? []);

    setTimeout(function () {
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const onSave = async (data: z.infer<typeof EducationValidationSchema>) => {
    setIsLoading(true);

    const result = await addEducationToResume(params.id, data.education);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Educational details updated successfully.",
        className: "bg-white",
      });
      handleInputChange({
        target: {
          name: "education",
          value: data.education,
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
          Education
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add your educational details
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
                {educationFields.map((config) => (
                  <FormField
                    key={config.name}
                    control={form.control}
                    name={`education.${index}.${config.name}`}
                    render={({ field }) => (
                      <FormItem className={config.colSpan || ""}>
                        {config.type === "textarea" ? (
                          <div className="flex justify-between items-end">
                            <FormLabel className="text-slate-700 font-semibold text-md">
                              {config.label}:
                            </FormLabel>
                            <Button
                              variant="outline"
                              onClick={() =>
                                generateEducationDescriptionFromAI(index)
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
                          {config.type === "textarea" ? (
                            <Textarea
                              {...field}
                              value={(field.value as string) || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(index, e);
                              }}
                              className={`no-focus ${
                                form.formState.errors.education?.[index]?.[
                                  config.name
                                ]
                                  ? "error"
                                  : ""
                              }`}
                              rows={6}
                            />
                          ) : (
                            <Input
                              type={config.type}
                              {...field}
                              value={field.value as string}
                              className={`no-focus ${
                                form.formState.errors.education?.[index]?.[
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
                  onClick={AddNewEducation}
                  className="text-primary"
                  type="button"
                >
                  <Plus className="size-4 mr-2" /> Add More
                </Button>
                <Button
                  variant="outline"
                  onClick={() => RemoveEducation(fields.length - 1)}
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

      {aiGeneratedDescriptionList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="my-5"
          ref={listRef}
        >
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedDescriptionList?.map((item: any, index: number) => (
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
                  `education.${currentAiIndex}.description`,
                  item?.description,
                  { shouldValidate: true }
                );
                handleInputChange({
                  target: {
                    name: "education",
                    value: form.getValues("education"),
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

export default EducationForm;
