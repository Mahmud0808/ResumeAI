"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateProjectDescription } from "@/lib/actions/gemini.actions";
import { addProjectsToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, Minus, Plus } from "lucide-react";
import React, { useRef, useState } from "react";

const ProjectsForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState(
    [] as any
  );
  const [projectsList, setProjectsList] = useState(
    formData?.projects.length > 0
      ? formData?.projects
      : [
          {
            title: "",
            companyName: "",
            startDate: "",
            endDate: "",
            projectSummary: "",
            githubRepo: "", // New field for GitHub repo link

          },
        ]
  );
  const [currentAiIndex, setCurrentAiIndex] = useState(
    projectsList.length - 1
  );
  const { toast } = useToast();

  const handleChange = (index: number, event: any) => {
    const newEntries = projectsList.slice();
    const { name, value } = event.target;

    console.log(name, value)
    newEntries[index][name] = value;
    setProjectsList(newEntries);

    handleInputChange({
      target: {
        name: "projects",
        value: newEntries,
      },
    });
  };

  const AddNewProject = () => {
    const newEntries = [
      ...projectsList,
      {
        title: "",
        companyName: "",
        startDate: "",
        endDate: "",
        projectSummary: "",
        githubRepo: "", // New field for GitHub repo link

      },
    ];
    setProjectsList(newEntries);

    handleInputChange({
      target: {
        name: "projects",
        value: newEntries,
      },
    });
  };

  const RemoveProject= () => {
    const newEntries = projectsList.slice(0, -1);
    setProjectsList(newEntries);

    if (currentAiIndex > newEntries.length - 1) {
      setCurrentAiIndex(newEntries.length - 1);
    }

    handleInputChange({
      target: {
        name: "projects",
        value: newEntries,
      },
    });
  };

  const generateProjectDescriptionFromAI = async (index: number) => {
    if (
      !formData?.projects[index]?.title ||
      formData?.projects[index]?.title === "" ||
      !formData?.projects[index]?.companyName ||
      formData?.projects[index]?.companyName === ""
    ) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "Please enter the position title and company name to generate summary.",
        variant: "destructive",
        className: "bg-white border-2",
      });

      return;
    }

    setCurrentAiIndex(index);

    setIsAiLoading(true);

    const result = await generateProjectDescription(
      `${formData?.projects[index]?.title} at ${formData?.projects[index]?.companyName}`
    );

    setAiGeneratedSummaryList(result);

    setIsAiLoading(false);

    setTimeout(function () {
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await addProjectsToResume(params.id, formData.projects);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Professional experience updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-white">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          Projects
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add your projects
        </p>

        <div className="mt-5">
          {projectsList.map((item: any, index: number) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    Project Title:
                  </label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.title}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    Company Name:
                  </label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.companyName}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    Start Date:
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.startDate}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    End Date:
                  </label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.endDate}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                <label className="text-slate-700 font-semibold">GitHub Repository Link:</label>
                <Input type="url" name="githubRepo" onChange={(event) => handleChange(index, event)} defaultValue={item?.githubRepo} className="no-focus" />
              </div>
                <div className="col-span-2 space-y-2">
                  <div className="flex justify-between items-end">
                    <label className=" text-slate-700 font-semibold">
                      Summary:
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        generateProjectDescriptionFromAI(index);
                      }}
                      type="button"
                      size="sm"
                      className="border-primary text-primary flex gap-2"
                      disabled={isAiLoading}
                    >
                      {isAiLoading && currentAiIndex === index ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}{" "}
                      Generate from AI
                    </Button>
                  </div>
                  <RichTextEditor
                    defaultValue={item?.projectSummary || ""}
                    onRichTextEditorChange={(value: string) =>
                      handleChange(index, value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewProject}
              className="text-primary"
            >
              <Plus className="size-4 mr-2" /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveProject}
              className="text-primary"
            >
              <Minus className="size-4 mr-2" /> Remove
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onSave}
            className="bg-primary-700 hover:bg-primary-800 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className="my-5" ref={listRef}>
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummaryList?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() =>
                handleChange(currentAiIndex, {
                  target: { name: "projectSummary", value: item?.description },
                })
              }
              className={`p-5 shadow-lg my-4 rounded-lg border-t-2 ${
                isAiLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-disabled={isAiLoading}
            >
              <h2 className="font-semibold my-1 text-primary text-gray-800">
                Level: {item?.activity_level}
              </h2>
              <p className="text-justify text-gray-600">{item?.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
