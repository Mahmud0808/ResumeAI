"use client";

import Header from "@/components/layout/Header";
import { useUser } from "@clerk/nextjs";
import { ArrowBigUp, AtomIcon, Edit, Share2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import BlurText from "@/components/BlurText";
import GradientText from "@/components/GradientText";
import GridMotion from "@/components/GridMotion";
import SpotlightCard from "@/components/SpotlightCard";
const items = [
  'https://marketplace.canva.com/EAFrc1XfAas/2/0/1131w/canva-professional-modern-cv-resume-8TGMKM03pPc.jpg', // Resume Now - General Examples
  'https://cv-creator.co.uk/wp-content/uploads/doc-builder/cv/miniatures/cvuk-22-blue.png', // MyPerfectResume - Customer Service
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/s2BIsMAfe7-photo.png', // JobHero - Teacher
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/r_Wj5A_OGv-photo.png', // Resume Genius - Simple Template
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/modern-colorful-corporate-cv-and-resume-design-template-c4ff17dcf187373aeb0cb33e173c8b3f_screen.jpg?ts=1637041127',
  'https://cv-creator.co.uk/wp-content/uploads/doc-builder/cv/miniatures/cvuk-22-blue.png', // MyPerfectResume - Customer Service
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/s2BIsMAfe7-photo.png', // JobHero - Teacher
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/r_Wj5A_OGv-photo.png', // Resume Genius - Simple Template
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/modern-colorful-corporate-cv-and-resume-design-template-c4ff17dcf187373aeb0cb33e173c8b3f_screen.jpg?ts=1637041127',
  'https://marketplace.canva.com/EAFrc1XfAas/2/0/1131w/canva-professional-modern-cv-resume-8TGMKM03pPc.jpg', // Resume Now - General Examples
  'https://cv-creator.co.uk/wp-content/uploads/doc-builder/cv/miniatures/cvuk-22-blue.png', // MyPerfectResume - Customer Service
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/s2BIsMAfe7-photo.png', // JobHero - Teacher
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/r_Wj5A_OGv-photo.png', // Resume Genius - Simple Template
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/modern-colorful-corporate-cv-and-resume-design-template-c4ff17dcf187373aeb0cb33e173c8b3f_screen.jpg?ts=1637041127',
  'https://marketplace.canva.com/EAFrc1XfAas/2/0/1131w/canva-professional-modern-cv-resume-8TGMKM03pPc.jpg', // Resume Now - General Examples
  'https://cv-creator.co.uk/wp-content/uploads/doc-builder/cv/miniatures/cvuk-22-blue.png', // MyPerfectResume - Customer Service
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/s2BIsMAfe7-photo.png', // JobHero - Teacher
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/r_Wj5A_OGv-photo.png', // Resume Genius - Simple Template
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/modern-colorful-corporate-cv-and-resume-design-template-c4ff17dcf187373aeb0cb33e173c8b3f_screen.jpg?ts=1637041127',
  'https://marketplace.canva.com/EAFrc1XfAas/2/0/1131w/canva-professional-modern-cv-resume-8TGMKM03pPc.jpg', // Resume Now - General Examples
  'https://cv-creator.co.uk/wp-content/uploads/doc-builder/cv/miniatures/cvuk-22-blue.png', // MyPerfectResume - Customer Service
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/s2BIsMAfe7-photo.png', // JobHero - Teacher
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/r_Wj5A_OGv-photo.png', // Resume Genius - Simple Template
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/modern-colorful-corporate-cv-and-resume-design-template-c4ff17dcf187373aeb0cb33e173c8b3f_screen.jpg?ts=1637041127',
  'https://marketplace.canva.com/EAFrc1XfAas/2/0/1131w/canva-professional-modern-cv-resume-8TGMKM03pPc.jpg', // Resume Now - General Examples
  'https://cv-creator.co.uk/wp-content/uploads/doc-builder/cv/miniatures/cvuk-22-blue.png', // MyPerfectResume - Customer Service
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/s2BIsMAfe7-photo.png', // JobHero - Teacher
  'https://s3.eu-west-2.amazonaws.com/resumedone-eu-west-2-staging/r_Wj5A_OGv-photo.png', // Resume Genius - Simple Template
  'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/modern-colorful-corporate-cv-and-resume-design-template-c4ff17dcf187373aeb0cb33e173c8b3f_screen.jpg?ts=1637041127',
  
];

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};
const page = () => {
  const user = useUser();

  return (
    <div>
      <Header />
      <section>
        <div className="py-8 px-6 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 md:px-10">
            <h1 className="mt-4 lg:mt-8 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black md:text-5xl lg:text-6xl flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
              <BlurText
                text="Build  Your  Resume  with  "
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
              />
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={9}
              >
                AI
              </GradientText>
              </div>
            </h1>
          <p className="mb-8 text-lg font-normal text-gray-700 lg:text-xl sm:px-16 xl:px-48">
            Effortlessly Craft a Professional Resume with Our AI-Powered Builder and generate a motivation letter !
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              href={`${!user?.isSignedIn ? "/sign-up" : "/dashboard"}`}
              className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
            >
              <span className="relative text-base font-semibold text-white">
                Get Started
              </span>
            </Link>
            <Link
              href="#learn-more"
              className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-slate-200 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
            >
              <span className="relative text-base font-semibold text-primary">
                Learn more
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-8 px-0 mx-auto w-full text-center lg:py-8 lg:px-0 md:px-0">
      <GridMotion items={items} />
      
        <h2 className="font-bold text-3xl mt-20" id="learn-more">
          How it Works?
        </h2>
        <h2 className="text-md text-gray-500">
          Generate resume in just 3
           steps
        </h2>
        

        <div className="mt-8 grid grid-cols-1 gap-8 text-center md:text-start md:grid-cols-2 lg:grid-cols-3 md:px-24">
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
        <AtomIcon className="h-8 w-8" />

        <h2 className="mt-4 text-xl font-bold text-black">
          Create Your Template
        </h2>

        <p className="mt-1 text-sm text-gray-600 md:text-justify">
          Start by selecting the color scheme for your resume template. Our
          single, professionally designed template ensures a clean and
          consistent look for all users.
        </p>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
        <Edit className="h-8 w-8" />

        <h2 className="mt-4 text-xl font-bold text-black">
          Update Your Information
        </h2>

        <p className="mt-1 text-sm text-gray-600 md:text-justify">
          Enter your personal details, work experience, education, and
          skills into the provided form. Our AI assists you in filling out
          each section accurately and effectively.
        </p>
        
          </SpotlightCard>
          
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
        <Share2 className="h-8 w-8" />

        <h2 className="mt-4 text-xl font-bold text-black">
          Share Your Resume
        </h2>

        <p className="mt-1 text-sm text-gray-600 md:text-justify">
          After completing your resume, save it securely and generate a
          shareable link. Easily update your information anytime and share
          the link with potential employers or download it in a preferred
          format.
        </p>
        </SpotlightCard>
        </div>
        

        <div className="mt-20 text-center">
          <Link
        href="#get-started"
        className="inline-block rounded-full bg-primary-700 px-12 py-3 text-sm font-medium text-white transition hover:bg-primary-800 focus:outline-none focus:ring focus:ring-primary-400"
          >
        <div className="flex items-center justify-center">
          <ArrowBigUp className="h-6 w-6 mr-2" />
          Get Started Today
        </div>
          </Link>
        </div>
      </section>
      <footer className="backdrop-blur-md w-full">
        <div className="w-full mx-auto text-center max-w-screen-xl p-4 flex max-md:flex-col md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2025{" "}
            <span className="hover:text-primary-500 hover:cursor-pointer">
              TalentSketch™
            </span>
            . All Rights Reserved.
          </span>
          <Link href="https://github.com/Mahmud0808" className="me-4 md:me-6">
            <span className="hover:text-primary-500 mt-3 text-sm font-medium text-gray-500 sm:mt-0">
              Made by INDP2B
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default page;
