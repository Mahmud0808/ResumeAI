"use client";

import { ReactNode, useEffect } from "react";
import { createContext, useState, useContext } from "react";
import { fetchResume } from "../actions/resume.actions";

const FormContext = createContext({} as any);

export const FormProvider = ({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState({});

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
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, handleInputChange }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
