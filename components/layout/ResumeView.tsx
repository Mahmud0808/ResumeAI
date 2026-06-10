"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FormProvider } from "@/lib/context/FormProvider";
import { RWebShare } from "react-web-share";
import React, { useEffect, useState } from "react";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import { DownloadIcon, Globe, Lock, Share2Icon } from "lucide-react";
import { fetchResume, updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/common/motion";

interface FinalResumeViewProps {
  params: { id: string };
  isOwnerView: boolean;
}

const FinalResumeView: React.FC<FinalResumeViewProps> = ({
  params,
  isOwnerView,
}) => {
  const path = usePathname();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [isPublic, setIsPublic] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await fetchResume(params.id);
        const parsed = JSON.parse(resumeData);
        setFormData(parsed);
        if (parsed) {
          setIsPublic(parsed.isPublic === true);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    loadResumeData();
  }, [params.id]);

  const toggleVisibility = async () => {
    const next = !isPublic;
    setIsTogglingVisibility(true);

    const result = await updateResume({
      resumeId: params.id,
      updates: { isPublic: next },
    });

    setIsTogglingVisibility(false);

    if (result.success) {
      setIsPublic(next);
      toast({
        title: next ? "Resume is now public" : "Resume is now private",
        description: next
          ? "Anyone with the link can view it."
          : "Only you can view it now.",
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

  const sanitize = (str: string | undefined | null): string =>
    str?.trim().replace(/\s+/g, "_") || "User_Resume";

  /**
   * Uses the browser's native print-to-PDF. Real vector text (selectable,
   * ATS-readable), no server cost. The @media print rules in globals.css hide
   * everything except #print-area. Setting document.title seeds the suggested
   * filename in the print dialog's "Save as PDF".
   */
  const handleDownloadPDF = () => {
    const previousTitle = document.title;
    document.title = sanitize(
      `${formData?.firstName ?? "User"}_${formData?.lastName ?? ""}_${
        formData?.jobTitle ?? ""
      }_Resume`
    );

    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  };

  return (
    <>
      <PageWrapper>
        <FormProvider params={params}>
          <div id="no-print">
            <Header />
            <FadeIn className="my-8 mx-6 sm:mx-10 md:my-10 md:mx-20 lg:mx-36">
              {isOwnerView && (
                <>
                  <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    Congrats! Your ultimate AI-generated resume is ready!
                  </h2>
                  <p className="mt-1 text-center text-sm text-gray-600 md:text-base">
                    You can now download your resume or share its unique URL
                    with your friends and family.
                  </p>
                </>
              )}
              <div className="mx-auto my-8 flex w-fit max-sm:w-full max-sm:flex-col items-center justify-center gap-4 rounded-full max-sm:rounded-3xl border border-slate-200/70 bg-white/70 p-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:gap-6 md:my-10">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="max-sm:w-full"
                >
                  <Button
                    className="flex w-full px-10 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 shadow-md shadow-primary-700/25 focus:ring-4 focus:ring-primary-700/30 text-white sm:px-12"
                    onClick={() => handleDownloadPDF()}
                  >
                    <DownloadIcon className="size-6" /> Download
                  </Button>
                </motion.div>
                <RWebShare
                  data={{
                    text: "Check out my resume!",
                    url: `${path}`,
                    title: `${formData?.firstName ?? "User"} ${
                      formData?.lastName ?? "Resume"
                    }'s Resume`,
                  }}
                  onClick={() => console.log("Shared successfully!")}
                >
                  <Button className="flex max-sm:w-full px-10 py-6 gap-2 rounded-full bg-slate-100 hover:bg-primary-700/10 focus:ring-4 focus:ring-primary-700/30 text-slate-900 sm:px-12">
                    <Share2Icon className="size-6" /> Share URL
                  </Button>
                </RWebShare>
              </div>
              {isOwnerView && (
                <div className="flex flex-col items-center gap-2 -mt-4 mb-6">
                  <Button
                    variant="outline"
                    className="flex gap-2 rounded-full"
                    disabled={isTogglingVisibility}
                    onClick={toggleVisibility}
                  >
                    {isPublic ? (
                      <>
                        <Globe className="size-5" /> Public — anyone with the
                        link
                      </>
                    ) : (
                      <>
                        <Lock className="size-5" /> Private — only you
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    {isPublic
                      ? "Click to make this resume private."
                      : "Click to make this resume shareable by link."}
                  </p>
                </div>
              )}
            </FadeIn>
          </div>
          <div className="px-10 pt-4 pb-16 max-sm:px-5 max-sm:pb-8 print:p-0">
            <div id="print-area">
              <ResumePreview />
            </div>
          </div>
        </FormProvider>
      </PageWrapper>
    </>
  );
};

export default FinalResumeView;
