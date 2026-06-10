"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { updateResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { sanitizeNbsp } from "@/lib/utils";
import { CustomSectionValidationSchema } from "@/lib/validations/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const CustomSectionsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof CustomSectionValidationSchema>>({
    resolver: zodResolver(CustomSectionValidationSchema),
    mode: "onChange",
    defaultValues: {
      sections: Array.isArray(formData?.customSections)
        ? formData.customSections.map((section: any) => ({
            title: section?.title || "",
            body: section?.body || "",
          }))
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const syncContext = () => {
    handleInputChange({
      target: {
        name: "customSections",
        value: form.getValues("sections"),
      },
    });
  };

  const AddSection = () => {
    append({ title: "", body: "" });
    syncContext();
  };

  const RemoveSection = () => {
    remove(fields.length - 1);
    syncContext();
  };

  const onSave = async (data: z.infer<typeof CustomSectionValidationSchema>) => {
    setIsLoading(true);

    // Keep stored HTML ATS-friendly: no &nbsp; runs from Quill.
    const sections = data.sections.map((section) => ({
      title: section.title,
      body: sanitizeNbsp(section.body),
    }));

    const result = await updateResume({
      resumeId: params.id,
      updates: { customSections: sections },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Custom sections updated successfully.",
        className: "bg-white",
      });
      handleInputChange({
        target: { name: "customSections", value: sections },
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
        Custom Sections
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add your own sections — certifications, projects, languages, anything.
        Optional: leave empty if you don't need them.
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
              className="border border-slate-200/80 p-3 sm:p-4 my-5 rounded-xl bg-slate-50/50 space-y-3"
            >
              <FormField
                control={form.control}
                name={`sections.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-md">
                      Section Title:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Certifications, Projects, Languages"
                        className={`no-focus ${
                          form.formState.errors.sections?.[index]?.title
                            ? "error"
                            : ""
                        }`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          syncContext();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sections.${index}.body`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-md">
                      Body:
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        defaultValue={(field.value as string) || ""}
                        onRichTextEditorChange={(e) => {
                          field.onChange(e.target.value);
                          syncContext();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
          </AnimatePresence>

          <div className="mt-3 flex flex-wrap gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={AddSection}
                className="text-primary"
                type="button"
              >
                <Plus className="size-4 mr-2" /> Add Section
              </Button>
              {fields.length > 0 && (
                <Button
                  variant="outline"
                  onClick={RemoveSection}
                  className="text-primary"
                  type="button"
                >
                  <Minus className="size-4 mr-2" /> Remove
                </Button>
              )}
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
  );
};

export default CustomSectionsForm;
