import PageWrapper from "@/components/common/PageWrapper";
import DashboardCards from "@/components/layout/DashboardCards";
import Header from "@/components/layout/Header";
import React from "react";

const Dashboard = () => {
  return (
    <PageWrapper>
      <Header />
      <div className="my-10 !mb-0 mx-10 md:mx-20 lg:mx-36">
        <h2 className="text-center text-2xl font-bold">
          Your Resume Dashboard
        </h2>
        <p className="text-center text-gray-600">
          Begin creating and managing your personalized resumes.
        </p>
      </div>
      <div className="p-10 md:px-24 lg:px-48">
        <DashboardCards />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
