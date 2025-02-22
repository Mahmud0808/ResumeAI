"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FormProvider, useFormContext } from "@/lib/context/FormProvider";
import { RWebShare } from "react-web-share";
import React from "react";
import ResumeTemplateSelector from "./my-resume/ResumeTemplateSelector";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import { DownloadIcon, Share2Icon, Mails } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FinalResumeView = ({
  params,
  isOwnerView,
}: {
  params: { id: string };
  isOwnerView: boolean;
}) => {
  const path = usePathname();
  const { formData } = useFormContext();

  const handleDownload = async () => {
    const element = document.getElementById('print-area');
    if (!element) return;

    try {
      // Set canvas width to match A4 proportion (roughly 1:1.414)
      const a4Width = 793;  // roughly A4 width at 96 DPI
      const a4Height = 1122; // roughly A4 height at 96 DPI

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: a4Width,
        height: a4Height
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Get PDF dimensions in points (pt)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        'FAST'
      );

      pdf.save(`${formData?.firstName || 'Resume'}_${formData?.lastName || ''}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleMotivationLetterClick = () => {
    console.log(formData)
  }

  return (
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
                  You can now download your resume or share its unique URL with
                  your friends and family.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-center text-2xl font-bold">
                  Resume Preview
                </h2>
                <p className="text-center text-gray-600">
                  You are currently viewing a preview of someone else's resume.
                </p>
                <p className="text-center text-sm text-gray-500 font-light">
                  For the ultimate experience, create your own AI-generated
                  resume.
                </p>
              </>
            )}
            <div className="flex max-sm:flex-col justify-center gap-8 my-10">
              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-6" /> Download
              </Button>
              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleMotivationLetterClick}
              >
                <Mails className="size-6" /> Generate Motivation Letter
              </Button>
              <RWebShare
                data={{
                  text: "Hello everyone, check out my resume by clicking the link!",
                  url: `${process.env.BASE_URL}/${path}`,
                  title: `${formData?.firstName} ${formData?.lastName}'s Resume`,
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
          <div
            id="print-area"
            className="w-[21cm] mx-auto" // Fixed width of A4 and center horizontally
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              justifyContent: 'flex-start' // Align content to start from left
            }}
          >
            <ResumeTemplateSelector />
          </div>
        </div>
      </FormProvider>
    </PageWrapper>
  );
};

export default FinalResumeView;
