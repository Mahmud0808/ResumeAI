"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "@/lib/context/FormProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import { Loader2, Minus, Plus } from "lucide-react";
import "@smastrom/react-rating/style.css";
import { addSkillToResume, updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";

const SkillsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [skillsList, setSkillsList] = useState(
    formData.skills.length > 0
      ? formData.skills
      : [
          {
            name: "",
            rating: 1,
          },
        ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (index: number, name: string, value: any) => {
    const newSkillsList = [...skillsList];
    newSkillsList[index][name] = value;
    setSkillsList(newSkillsList);

    handleInputChange({
      target: {
        name: "skills",
        value: newSkillsList,
      },
    });
  };

  const AddNewSkills = () => {
    const newSkillsList = [
      ...skillsList,
      {
        name: "",
        rating: 1,
      },
    ];
    setSkillsList(newSkillsList);

    handleInputChange({
      target: {
        name: "skills",
        value: newSkillsList,
      },
    });
  };

  const RemoveSkills = () => {
    const newSkillsList = skillsList.slice(0, -1);
    setSkillsList(newSkillsList);

    handleInputChange({
      target: {
        name: "skills",
        value: newSkillsList,
      },
    });
  };

  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await addSkillToResume(params.id, formData.skills);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Skill sets updated successfully.",
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-white">
      <h2 className="text-lg font-semibold leading-none tracking-tight">
        Skill Sets
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add Your top professional key skills
      </p>

      <div className="mt-5">
        {skillsList.map((item: any, index: number) => (
          <div
            key={index}
            className="flex max-lg:flex-col lg:items-end justify-between mb-2 border rounded-lg p-3 space-y-2 lg:space-x-12"
          >
            <div className="space-y-2 w-full">
              <label className="mt-2 text-slate-700 font-semibold">Name:</label>
              <Input
                className="no-focus mt-2"
                defaultValue={item.name}
                onChange={(e: any) =>
                  handleChange(index, "name", e.target.value)
                }
              />
            </div>
            <Rating
              style={{ maxWidth: 160, height: 46 }}
              value={item.rating || 1}
              onChange={(v: any) => handleChange(index, "rating", v)}
              orientation="horizontal"
              isRequired
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2 justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewSkills}
            className="text-primary"
          >
            <Plus className="size-4 mr-2" /> Add More
          </Button>
          <Button
            variant="outline"
            onClick={RemoveSkills}
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
  );
};

export default SkillsForm;
