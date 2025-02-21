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
  const [template, setTemplate] = useState(1);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await fetchResume(params.id);
        const parsed = JSON.parse(resumeData);
        setFormData(parsed);
        setTemplate(parsed.template || 1);
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

  const changeTemplate = (templateNumber: number) => {
    setTemplate(templateNumber);
    setFormData((prevData: any) => ({
      ...prevData,
      template: templateNumber,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, handleInputChange, template, changeTemplate }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
