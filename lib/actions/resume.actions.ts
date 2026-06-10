"use server";

import Education from "../models/education.model";
import Experience from "../models/experience.model";
import Resume from "../models/resume.model";
import Skill from "../models/skill.model";
import { connectToDB } from "../mongoose";
import { getCurrentUserId, requireUserId } from "../auth";
import { revalidatePath } from "next/cache";

/**
 * Loads a resume and verifies the authenticated caller owns it.
 * Throws "Unauthorized" if not signed in, "Forbidden" if it belongs to
 * someone else, and "Resume not found" if it does not exist.
 */
async function assertResumeOwner(resumeId: string) {
  const userId = await requireUserId();

  await connectToDB();

  const resume = await Resume.findOne({ resumeId });

  if (!resume) {
    throw new Error("Resume not found");
  }

  if (resume.userId !== userId) {
    throw new Error("Forbidden");
  }

  return resume;
}

export async function createResume({
  resumeId,
  title,
}: {
  resumeId: string;
  title: string;
}) {
  try {
    const userId = await requireUserId();

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

export async function fetchUserResumes() {
  try {
    const userId = await requireUserId();

    await connectToDB();

    const resumes = await Resume.find({ userId: userId });

    return JSON.stringify(resumes);
  } catch (error: any) {
    throw new Error(`Failed to fetch user resumes: ${error.message}`);
  }
}

export async function checkResumeOwnership(resumeId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return false;
    }

    await connectToDB();

    const resume = await Resume.findOne({ resumeId: resumeId, userId: userId });

    return resume ? true : false;
  } catch (error: any) {
    console.error(`Failed to check resume ownership: ${error.message}`);
    return false;
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
    const resume = await assertResumeOwner(resumeId);

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
    const resume = await assertResumeOwner(resumeId);

    const savedExperiences = await Promise.all(
      experienceDataArray.map(async (experienceData: any) => {
        if (experienceData._id) {
          const existingExperience = await Experience.findById(
            experienceData._id
          );
          if (existingExperience) {
            return await Experience.findByIdAndUpdate(
              experienceData._id,
              experienceData,
              { new: true }
            );
          }
        }
        const newExperience = new Experience(experienceData);
        return await newExperience.save();
      })
    );

    const experienceIds = savedExperiences.map((experience) => experience._id);
    resume.experience = experienceIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding or updating experience to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function addEducationToResume(
  resumeId: string,
  educationDataArray: any
) {
  try {
    const resume = await assertResumeOwner(resumeId);

    const savedEducation = await Promise.all(
      educationDataArray.map(async (educationData: any) => {
        if (educationData._id) {
          const existingEducation = await Education.findById(educationData._id);
          if (existingEducation) {
            return await Education.findByIdAndUpdate(
              educationData._id,
              educationData,
              { new: true }
            );
          }
        }
        const newEducation = new Education(educationData);
        return await newEducation.save();
      })
    );

    const educationIds = savedEducation.map((education) => education._id);
    resume.education = educationIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding or updating education to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function addSkillToResume(resumeId: string, skillDataArray: any) {
  try {
    const resume = await assertResumeOwner(resumeId);

    const savedSkills = await Promise.all(
      skillDataArray.map(async (skillData: any) => {
        if (skillData._id) {
          const existingSkill = await Skill.findById(skillData._id);
          if (existingSkill) {
            return await Skill.findByIdAndUpdate(skillData._id, skillData, {
              new: true,
            });
          }
        }
        const newSkill = new Skill(skillData);
        return await newSkill.save();
      })
    );

    const skillIds = savedSkills.map((skill) => skill._id);
    resume.skills = skillIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding or updating skill to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function deleteResume(resumeId: string, path: string) {
  try {
    await assertResumeOwner(resumeId);

    await Resume.findOneAndDelete({ resumeId: resumeId });

    revalidatePath(path);

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete resume: ${error.message}`);
    return { success: false, error: error.message };
  }
}
