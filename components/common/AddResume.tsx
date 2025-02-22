"use client";

import { Loader2, PlusSquare, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { ResumeNameValidationSchema } from "@/lib/validations/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createResume } from "@/lib/actions/resume.actions";
import { toast } from "../ui/use-toast";
import { useRouter } from "next-nprogress-bar";

const AddResume = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1));
    setSelectedTemplate(currentSlide + 2 > 4 ? 1 : currentSlide + 2);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 3 : prev - 1));
    setSelectedTemplate(currentSlide === 0 ? 4 : currentSlide);
  };

  const form = useForm({
    resolver: zodResolver(ResumeNameValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ResumeNameValidationSchema>
  ) => {
    if (userId === undefined) {
      return;
    }



    console.log(selectedTemplate)

    setIsLoading(true);

    const uuid = uuidv4();

    const result = await createResume({
      resumeId: uuid,
      userId: userId,
      title: values.name,
      templateId: selectedTemplate,
    });

    if (result.success) {
      form.reset();

      const resume = JSON.parse(result.data!);

      router.push(`/my-resume/${resume.resumeId}/edit`);
    } else {
      setIsLoading(false);

      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <>
      <div
        className="relative aspect-[1/1.2] border border-dashed border-slate-300 flex items-center justify-center bg-slate-100 rounded-xl hover:scale-105 hover:shadow-md transition-all cursor-pointer"
        onClick={() => userId && setOpenDialog(true)}
      >
        <PlusSquare className="text-slate-500" />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Choose a template and enter the title of your resume.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="w-[300px] h-[400px] relative overflow-hidden">
                    <div
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {[1, 2, 3, 4].map((template) => (
                        <div
                          key={template}
                          className={`min-w-full px-2 ${selectedTemplate === template ? 'scale-105' : 'scale-100'
                            } transition-transform duration-300`}
                        >
                          <div
                            className={`rounded-lg p-2 cursor-pointer ${selectedTemplate === template
                              ? 'border-blue-500 shadow-sm'
                              : 'border-gray-200'
                              }`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <img
                              src={`/templates/template${template}.png`}
                              alt={`Template ${template}`}
                              className="w-full aspect-[1/1.4] object-cover rounded"
                            />
                            <div className="flex flex-col items-center mt-2">
                              <p className="text-sm text-gray-500">Template</p>
                              <p className="text-lg font-medium">{template}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Title:</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Example: Android Developer Resume"
                        className="no-focus"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-10 flex justify-end gap-5">
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  className="btn-ghost"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Creating
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddResume;
