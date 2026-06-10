"use client";

import { Loader2, PlusSquare } from "lucide-react";
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
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const AddResume = () => {
  const router = useRouter();
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResumeNameValidationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ResumeNameValidationSchema>
  ) => {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);

    const uuid = uuidv4();

    const result = await createResume({
      resumeId: uuid,
      title: values.name,
    });

    if (result.success) {
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
      <motion.div
        whileHover={{ scale: 1.04, y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group relative aspect-[1/1.2] border border-dashed border-slate-300 flex items-center justify-center bg-slate-100/80 rounded-xl hover:border-primary-400 hover:bg-primary-50/60 hover:shadow-lg hover:shadow-primary-700/10 transition-colors cursor-pointer"
        onClick={() => isSignedIn && setOpenDialog(true)}
      >
        <PlusSquare className="text-slate-500 transition-colors group-hover:text-primary-600" />
      </motion.div>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          // Clear the title only once the dialog is dismissed, not on create.
          if (!open) {
            form.reset({ name: "" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Enter the title of your resume here. Click create when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="comment-form"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-2 mb-3 text-slate-700 font-semibold">
                        Resume Title:
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Example: Android Developer Resume"
                        className={`no-focus ${
                          form.formState.errors.name ? "error" : ""
                        }`}
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
                  onClick={() => {
                    setOpenDialog(false);
                    form.reset({ name: "" });
                  }}
                  className="btn-ghost"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                >
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
