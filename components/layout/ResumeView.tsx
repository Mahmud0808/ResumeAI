"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FormProvider } from "@/lib/context/FormProvider";
import { RWebShare } from "react-web-share";
import React, { useEffect, useState } from "react";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import { DownloadIcon, Share2Icon } from "lucide-react";
import { fetchResume } from "@/lib/actions/resume.actions";
import html2pdf from "html2pdf.js";

interface FinalResumeViewProps {
  params: { id: string };
  isOwnerView: boolean;
}

const FinalResumeView: React.FC<FinalResumeViewProps> = ({
  params,
  isOwnerView,
}) => {
  const [download, setDownload] = useState<boolean>(false);
  const path = usePathname();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await fetchResume(params.id);
        setFormData(JSON.parse(resumeData));
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    loadResumeData();
  }, [params.id]);

  const sanitize = (str: string | undefined | null): string =>
    str?.trim().replace(/\s+/g, "_") || "User_Resume";

  const handleDownloadPDF = () => {
    const element = document.getElementById("print-area");
    const opt = {
      margin: 0,
      filename: `${sanitize(
        `${formData?.firstName ?? "User"}_${formData?.lastName ?? ""}_${
          formData?.jobTitle ?? ""
        }_Resume.pdf`
      )}`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    if (element) {
      setDownload(true);

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .finally(() => {
          setDownload(false);
        });
    }
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
            </div>
          </div>
          <div className="px-10 pt-4 pb-16 max-sm:px-5 max-sm:pb-8 print:p-0">
            <div id="print-area">
              <ResumePreview download={download} />
            </div>
          </div>
        </FormProvider>
      </PageWrapper>
    </>
  );
};

export default FinalResumeView;
