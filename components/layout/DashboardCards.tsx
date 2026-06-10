"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const DashboardCards = () => {
  const { status } = useSession();
  const [resumeList, setResumeList] = useState(null as any);

  const loadResumeData = async () => {
    try {
      const resumeData = await fetchUserResumes();

      setResumeList(JSON.parse(resumeData as any));
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadResumeData();
    }
  }, [status]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-10 gap-8">
        <AddResume />

        {resumeList !== null
          ? resumeList.map((resume: any) => (
              <ResumeCard
                key={resume.resumeId}
                resume={JSON.stringify(resume)}
                refreshResumes={loadResumeData}
              />
            ))
          : [1, 2, 3].map((index) => (
              <ResumeCard
                key={index}
                resume={null}
                refreshResumes={loadResumeData}
              />
            ))}
      </div>
    </>
  );
};

export default DashboardCards;
