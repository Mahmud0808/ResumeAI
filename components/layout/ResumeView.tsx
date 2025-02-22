"use client";

import { Button } from "@/components/ui/button";
import { FormProvider, useFormContext } from "@/lib/context/FormProvider";
import Header from "@/components/layout/Header";
import React, { useState, useEffect, useRef } from "react";
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
  const { formData, setFormData } = useFormContext();
  const [post, setPost] = useState(formData?.post || "");
  const [companyName, setCompanyName] = useState(formData?.companyName || "");
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedCVContent, setCapturedCVContent] = useState<string>('');
  const printAreaRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (setFormData) {
      setFormData({ ...formData, post, companyName });
    }
  }, [post, companyName, formData, setFormData]);

  const captureResumeContent = () => {
    if (resumeContentRef.current) {
      try {
        // Get all text content excluding buttons and UI elements
        const content = Array.from(resumeContentRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div'))
          .map(element => element.textContent)
          .filter(text => text && text.trim().length > 0)
          .join('\n');

        if (!content || content.trim().length === 0) {
          console.error('No content captured from resume');
          return '';
        }

        console.log('Captured CV content:', content);
        setCapturedCVContent(content);
        return content;
      } catch (error) {
        console.error('Error capturing resume content:', error);
        return '';
      }
    }
    return '';
  };

  // Use useEffect to capture content when component mounts
  useEffect(() => {
    const content = captureResumeContent();
    if (content) {
      setCapturedCVContent(content);
    }
  }, []);

  const generateLetter = async () => {
    try {
      if (!post || !companyName) {
        alert("Please enter both the position and company name");
        return;
      }

      // Show loading state
      const button = document.querySelector('[data-generate-button]');
      if (button) button.textContent = 'Generating...';

      const cvContent = capturedCVContent || captureResumeContent();

      if (!cvContent.trim()) {
        throw new Error('Could not capture resume content');
      }

      const response = await generateMotivationLetter({
        cvText: cvContent,
        post,
        companyName,
      });

      console.log('Raw API Response:', response); // Debug log

      if (!response) {
        throw new Error('No response received from the API');
      }

      let letterContent;
      try {
        // If response is a string, try to parse it
        if (typeof response === 'string') {
          try {
            const parsedResponse = JSON.parse(response);
            letterContent = parsedResponse.motivation_letter || parsedResponse;
          } catch {
            // If JSON parsing fails, use the string directly
            letterContent = response;
          }
        } else if (typeof response === 'object') {
          // If response is already an object, extract the letter
          letterContent = response.motivation_letter || JSON.stringify(response, null, 2);
        } else {
          letterContent = String(response);
        }

        console.log('Processed Letter Content:', letterContent); // Debug log

        // Format the content by adding proper line breaks and spacing
        const formattedContent = letterContent
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string | any[]) => line.length > 0)
          .join('\n\n');

        // Open in a new window with improved formatting
        const newWindow = window.open();
        if (!newWindow) {
          throw new Error('Could not open new window');
        }

        newWindow.document.write(`
          <html>
            <head>
              <title>Motivation Letter</title>
              <style>
                body { 
                  font-family: 'Arial', sans-serif;
                  line-height: 1.8;
                  max-width: 800px;
                  margin: 40px auto;
                  padding: 20px;
                  background-color: #f9fafb;
                  color: #1f2937;
                }
                .container {
                  background-color: white;
                  padding: 2.5rem;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #2563eb;
                  font-size: 1.5rem;
                  margin-bottom: 2rem;
                  text-align: center;
                }
                .letter-content {
                  white-space: pre-wrap;
                  text-align: justify;
                }
                .letter-content p {
                  margin-bottom: 1rem;
                }
                .meta-info {
                  margin-bottom: 2rem;
                  color: #4b5563;
                }
                @media print {
                  body {
                    background: white;
                  }
                  .container {
                    box-shadow: none;
                    padding: 0;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Motivation Letter</h1>
                <div class="meta-info">
                  <strong>Position:</strong> ${post}<br>
                  <strong>Company:</strong> ${companyName}
                </div>
                <div class="letter-content">
                  ${formattedContent}
                </div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();

        setGeneratedLetter(letterContent);
        setIsDialogOpen(false);

      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.error('Raw response:', response);
        throw new Error('Failed to parse the generated letter');
      }

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
                    className="w-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
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
          <div
            id="print-area"
            ref={resumeContentRef}
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
