"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "@/lib/context/FormProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import { BarChart3, List, Loader2, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "@smastrom/react-rating/style.css";
import { addSkillToResume, updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SkillValidationSchema } from "@/lib/validations/resume";
import { useEffect, useState } from "react";
import { z } from "zod";

const SkillsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const skillsStyle = formData?.skillsStyle === "list" ? "list" : "bars";

  const onStyleChange = async (style: "bars" | "list") => {
    if (style === skillsStyle) {
      return;
    }

    handleInputChange({
      target: { name: "skillsStyle", value: style },
    });

    const result = await updateResume({
      resumeId: params.id,
      updates: { skillsStyle: style },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Skills display style updated automatically.",
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

  const form = useForm<z.infer<typeof SkillValidationSchema>>({
    resolver: zodResolver(SkillValidationSchema),
    mode: "onChange",
    defaultValues: {
      skills:
        formData?.skills?.length > 0
          ? formData.skills
          : [
              {
                name: "",
                rating: 1,
                category: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  // Validate on mount so the Save button reflects actual validity instead
  // of staying disabled until the first keystroke.
  useEffect(() => {
    form.trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    const newEntries = form.getValues("skills").slice();
    newEntries[index] = { ...newEntries[index], [name]: value };
    handleInputChange({
      target: {
        name: "skills",
        value: newEntries,
      },
    });
  };

  const handleRatingChange = (index: number, value: number) => {
    const newEntries = form.getValues("skills").slice();
    newEntries[index] = { ...newEntries[index], rating: value };
    handleInputChange({
      target: {
        name: "skills",
        value: newEntries,
      },
    });
  };

  const onSave = async () => {
    setIsLoading(true);

    const skillsData = form.getValues("skills");
    const result = await addSkillToResume(params.id, skillsData);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Skill sets updated successfully.",
        className: "bg-white",
      });
      handleInputChange({
        target: {
          name: "skills",
          value: skillsData,
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
    <div className="p-5 sm:p-6 shadow-lg shadow-slate-200/60 rounded-xl border border-slate-200/60 border-t-primary-700 border-t-4 bg-white">
      <h2 className="text-lg font-semibold leading-none tracking-tight">
        Skill Sets
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add your top professional key skills
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-700">
          Display style:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onStyleChange("bars")}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
              skillsStyle === "bars"
                ? "border-primary-700 bg-primary-50/60 text-primary-700 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Rating bars
          </button>
          <button
            type="button"
            onClick={() => onStyleChange("list")}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
              skillsStyle === "list"
                ? "border-primary-700 bg-primary-50/60 text-primary-700 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="h-3.5 w-3.5" /> Plain list
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              ATS
            </span>
          </button>
        </div>
      </div>

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
              className={`flex max-lg:flex-col ${
                form.formState.errors.skills?.[index]?.name
                  ? "lg:items-center"
                  : "lg:items-end"
              } justify-between mb-2 border border-slate-200/80 rounded-xl bg-slate-50/50 p-3 sm:p-4 space-y-2 lg:space-x-12`}
            >
              <FormField
                control={form.control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                  <FormItem className="space-y-2 w-full">
                    <FormLabel className="text-slate-700 font-semibold text-md">
                      Name:
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={`no-focus ${
                          form.formState.errors.skills?.[index]?.name
                            ? "error"
                            : ""
                        }`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChange(index, e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {skillsStyle === "list" ? (
                <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 w-full">
                      <FormLabel className="flex items-baseline gap-1.5 text-slate-700 font-semibold text-md">
                        Group:
                        <span className="text-xs font-normal text-slate-400">
                          optional
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Backend, Frontend, Tools"
                          className="no-focus"
                          {...field}
                          value={(field.value as string) || ""}
                          onChange={(e) => {
                            field.onChange(e);
                            handleChange(index, {
                              target: {
                                name: "category",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name={`skills.${index}.rating`}
                  render={({ field }) => (
                    <Rating
                      style={{ maxWidth: 160, height: 46 }}
                      value={field.value || 1}
                      onChange={(value: number) => {
                        field.onChange(value);
                        handleRatingChange(index, value);
                      }}
                      orientation="horizontal"
                      isRequired
                    />
                  )}
                />
              )}
            </motion.div>
          ))}
          </AnimatePresence>
          <div className="mt-5 flex flex-wrap gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => append({ name: "", rating: 1, category: "" })}
                className="text-primary"
                type="button"
              >
                <Plus className="size-4 mr-2" /> Add More
              </Button>
              <Button
                variant="outline"
                onClick={() => remove(fields.length - 1)}
                className="text-primary"
                type="button"
              >
                <Minus className="size-4 mr-2" /> Remove
              </Button>
            </div>
            <Button
              disabled={isLoading || !form.formState.isValid}
              type="submit"
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
  );
};

export default SkillsForm;
