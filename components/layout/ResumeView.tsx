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
            <div className="my-10 mx-10 md:mx-20 lg:mx-36">
              {isOwnerView ? (
                <>
                  <h2 className="text-center text-2xl font-bold">
                    Congrats! Your ultimate AI-generated resume is ready!
                  </h2>
                  <p className="text-center text-gray-600">
                    You can now download your resume or share its unique URL
                    with your friends and family.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-center text-2xl font-bold">
                    Resume Preview
                  </h2>
                  <p className="text-center text-gray-600">
                    You are currently viewing a preview of someone else's
                    resume.
                  </p>
                </>
              )}
              <div className="flex max-sm:flex-col justify-center gap-8 my-10">
                <Button
                  className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                  onClick={() => handleDownloadPDF()}
                >
                  <DownloadIcon className="size-6" /> Download
                </Button>
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
                  <Button className="flex px-12 py-6 gap-2 rounded-full bg-slate-200 hover:bg-primary-700/20 focus:ring-4 focus:ring-primary-700/30 text-black">
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
            </div>
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
