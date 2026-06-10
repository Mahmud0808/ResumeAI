import PageWrapper from "@/components/common/PageWrapper";
import DashboardCards from "@/components/layout/DashboardCards";
import Header from "@/components/layout/Header";
import { FadeIn } from "@/components/common/motion";
import React from "react";

const Dashboard = () => {
  return (
    <PageWrapper>
      <Header />
      <FadeIn className="my-8 !mb-0 mx-6 sm:mx-10 md:my-10 md:mx-20 lg:mx-36">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Your Resume Dashboard
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600 md:text-base">
          Begin creating and managing your personalized resumes.
        </p>
      </FadeIn>
      <div className="p-6 sm:p-10 md:px-24 lg:px-48">
        <DashboardCards />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
