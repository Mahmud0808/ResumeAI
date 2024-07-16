"use server";

import { useUser } from "@clerk/nextjs";
import Education from "../models/education.model";
import Experience from "../models/experience.model";
import Resume from "../models/resume.model";
import Skill from "../models/skill.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function createResume({
  resumeId,
  userId,
  title,
}: {
  resumeId: string;
  userId: string;
  title: string;
}) {
  try {
    await connectToDB();

    const newResume = await Resume.create({
      resumeId,
      userId,
      title,
    });

    return { success: true, data: JSON.stringify(newResume) };
  } catch (error: any) {
    console.error(`Failed to create resume: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export async function fetchResume(resumeId: string) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId: resumeId })
      .populate({
        path: "experience",
        model: Experience,
      })
      .populate({
        path: "education",
        model: Education,
      })
      .populate({
        path: "skills",
        model: Skill,
      });

    return JSON.stringify(resume);
  } catch (error: any) {
    throw new Error(`Failed to fetch resume: ${error.message}`);
  }
}

export async function fetchUserResumes(userId: string) {
  if (userId === "") {
    return [];
  }
  
  try {
    await connectToDB();

    const resumes = await Resume.find({ userId: userId });

    return JSON.stringify(resumes);
  } catch (error: any) {
    throw new Error(`Failed to fetch user resumes: ${error.message}`);
  }
}

export async function checkResumeOwnership(userId: string, resumeId: string) {
  if (userId === "") {
    return false;
  }

  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId: resumeId, userId: userId });

    return resume ? true : false;
  } catch (error: any) {
    throw new Error(`Failed to check resume ownership: ${error.message}`);
  }
}

export async function updateResume({
  resumeId,
  updates,
}: {
  resumeId: string;
  updates: Partial<{
    firstName: string;
    lastName: string;
    jobTitle: string;
    address: string;
    phone: string;
    email: string;
    summary: string;
    themeColor: string;
  }>;
}) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId: resumeId });

    if (!resume) {
      return { success: false, error: "Resume not found" };
    }

    Object.keys(updates).forEach((key) => {
      const updateValue = updates[key as keyof typeof updates];

      if (updateValue !== undefined) {
        resume[key as keyof typeof updates] = updateValue;
      }
    });

    resume.updatedAt = new Date();

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error(`Failed to update resume: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export async function addExperienceToResume(
  resumeId: string,
  experienceDataArray: any
) {
  try {
    const savedExperiences = await Promise.all(
      experienceDataArray.map(async (experienceData: any) => {
        const newExperience = new Experience(experienceData);
        return await newExperience.save();
      })
    );

    const resume = await Resume.findOne({ resumeId: resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const experienceIds = savedExperiences.map((experience) => experience._id);
    resume.experience.push(...experienceIds);

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding experience to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function addEducationToResume(
  resumeId: string,
  educationDataArray: any
) {
  try {
    const savedEducation = await Promise.all(
      educationDataArray.map(async (educationData: any) => {
        const newEducation = new Education(educationData);
        return await newEducation.save();
      })
    );

    const resume = await Resume.findOne({ resumeId: resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const educationIds = savedEducation.map((education) => education._id);
    resume.education.push(...educationIds);

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding education to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function addSkillToResume(resumeId: string, skillDataArray: any) {
  try {
    const savedSkills = await Promise.all(
      skillDataArray.map(async (skillData: any) => {
        const newSkill = new Skill(skillData);
        return await newSkill.save();
      })
    );

    const resume = await Resume.findOne({ resumeId: resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const skillIds = savedSkills.map((skill) => skill._id);
    resume.skills.push(...skillIds);

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding skill to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function deleteResume(resumeId: string, path: string) {
  try {
    await connectToDB();

    await Resume.findOneAndDelete({ resumeId: resumeId });

    revalidatePath(path);

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete resume: ${error.message}`);
    return { success: false, error: error.message };
  }
}