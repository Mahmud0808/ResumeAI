"use client";

import { Button } from "@/components/ui/button";
import { Mails, Share2Icon, DownloadIcon } from "lucide-react";
import { FormProvider, useFormContext } from "@/lib/context/FormProvider";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import React, { useState, useEffect, useRef } from "react";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { RWebShare } from "react-web-share";
import { generateMotivationLetter } from "@/lib/actions/gemini.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FinalResumeView = ({
  params,
  isOwnerView,
}: {
  params: { id: string };
  isOwnerView: boolean;
}) => {
  const { formData, setFormData } = useFormContext();
  const [post, setPost] = useState(formData?.post || "");
  const [companyName, setCompanyName] = useState(formData?.companyName || "");
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedCVContent, setCapturedCVContent] = useState<string>('');
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (setFormData) {
      setFormData({ ...formData, post, companyName });
    }
  }, [post, companyName, formData, setFormData]);

  const captureResumeContent = () => {
    if (printAreaRef.current) {
      const content = printAreaRef.current.innerText;
      console.log('Captured CV content:', content);
      setCapturedCVContent(content);
      return content;
    }
    return '';
  };

  const handleDownload = () => {
    captureResumeContent();
    window.print();
  };

  const generateLetter = async () => {
    try {
      if (!post || !companyName) {
        alert("Please enter both the position and company name");
        return;
      }

      // Show loading state
      const button = document.querySelector('[data-generate-button]');
      if (button) button.textContent = 'Generating...';

      // Use captured content if available, otherwise try to capture it now
      const cvContent = capturedCVContent || captureResumeContent();

      if (!cvContent.trim()) {
        throw new Error('Could not capture resume content');
      }

      const letter = await generateMotivationLetter({
        cvText: cvContent,
        post,
        companyName,
      });

      if (!letter) {
        throw new Error('No response received from the API');
      }

      setGeneratedLetter(letter);
      setIsDialogOpen(false);

      // Open in a new window with better formatting
      const newWindow = window.open();
      newWindow?.document.write(`
        <html>
          <head>
            <title>Motivation Letter</title>
            <style>
              body { 
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
              }
              h2 { color: #2563eb; }
            </style>
          </head>
          <body>
            <h2>Motivation Letter</h2>
            <div style="white-space: pre-wrap;">${letter}</div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error details:", error);
      alert("Failed to generate motivation letter. Please try again. Error: " + (error as Error).message);
    } finally {
      // Reset button text
      const button = document.querySelector('[data-generate-button]');
      if (button) button.textContent = 'Generate Letter';
    }
  };

  const path = usePathname();

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
                  You can now download your resume or generate a motivation
                  letter.
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
              </>
            )}
            <div className="flex max-sm:flex-col justify-center gap-8 my-10">
              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-6" /> Download
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white">
                    <Mails className="size-6" /> Generate Motivation Letter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Generate Motivation Letter</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="post">Position</Label>
                      <Input
                        id="post"
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                        placeholder="Enter the position you're applying for"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter the company name"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={generateLetter}
                    className="w-full"
                    data-generate-button
                  >
                    Generate Letter
                  </Button>
                </DialogContent>
              </Dialog>

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
          <div id="print-area" ref={printAreaRef}>
            <ResumePreview />
          </div>
        </div>
      </FormProvider>
    </PageWrapper>
  );
};

export default FinalResumeView;
