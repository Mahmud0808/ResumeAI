"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "@/lib/context/FormProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import { Loader2, Minus, Plus } from "lucide-react";
import "@smastrom/react-rating/style.css";
import { addSkillToResume } from "@/lib/actions/resume.actions";
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
import { useState } from "react";
import { z } from "zod";

const SkillsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-white">
      <h2 className="text-lg font-semibold leading-none tracking-tight">
        Skill Sets
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add your top professional key skills
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="mt-5">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className={`flex max-lg:flex-col ${
                form.formState.errors.skills?.[index]?.name
                  ? "lg:items-center"
                  : "lg:items-end"
              } justify-between mb-2 border rounded-lg p-3 space-y-2 lg:space-x-12`}
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
            </div>
          ))}
          <div className="mt-5 flex gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => append({ name: "", rating: 1 })}
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
