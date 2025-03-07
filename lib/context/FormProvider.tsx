"use client";

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { fetchResume } from "../actions/resume.actions";

interface FormContextType {
  formData: any;
  handleInputChange: (e: { target: { name: string; value: any } }) => void;
  activeFormIndex: number;
  setActiveFormIndex: (index: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState<any>({});
  const [activeFormIndex, setActiveFormIndex] = useState(1);

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
  }, [params.id]);

  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const contextValue: FormContextType = {
    formData,
    handleInputChange,
    activeFormIndex,
    setActiveFormIndex,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
