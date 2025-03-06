"use client";

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { fetchResume } from "../actions/resume.actions";

// Define the shape of the context
interface FormContextType {
  formData: any; // Replace `any` with a more specific type if possible
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  activeFormIndex: number;
  setActiveFormIndex: (index: number) => void;
}

// Create the context with an initial undefined value
const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState<any>({}); // Replace `any` with your form data type
  const [activeFormIndex, setActiveFormIndex] = useState(1); // Add activeFormIndex state

  // Fetch resume data on mount
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
  }, [params.id]); // Add params.id as a dependency

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Provide the context value
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

// Custom hook to use the context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
