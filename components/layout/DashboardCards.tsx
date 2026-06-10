"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/common/motion";

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
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-6 gap-5 sm:mt-10 sm:gap-8"
      >
        <motion.div variants={staggerItemVariants}>
          <AddResume />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {resumeList !== null
            ? resumeList.map((resume: any) => (
                <motion.div
                  key={resume.resumeId}
                  layout
                  variants={staggerItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResumeCard
                    resume={JSON.stringify(resume)}
                    refreshResumes={loadResumeData}
                  />
                </motion.div>
              ))
            : [1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  variants={staggerItemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResumeCard resume={null} refreshResumes={loadResumeData} />
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default DashboardCards;
