"use server";

import Education from "../models/education.model";
import Experience from "../models/experience.model";
import Resume from "../models/resume.model";
import Skill from "../models/skill.model";
import { connectToDB } from "../mongoose";
import { getCurrentUserId, requireUserId } from "../auth";
import { verifyOwnership } from "../ownership";
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

  verifyOwnership(resume.userId, userId);

  return resume;
}

/**
 * Deletes sub-documents that were previously attached to a resume but are no
 * longer in the new set, preventing orphaned Experience/Education/Skill docs.
 */
async function deleteOrphans(
  model: { deleteMany: (filter: any) => Promise<any> },
  previous: any[],
  kept: any[]
) {
  const keptIds = new Set(kept.map((id) => id.toString()));
  const orphanIds = (previous ?? [])
    .map((id) => id.toString())
    .filter((id) => !keptIds.has(id));

  if (orphanIds.length) {
    await model.deleteMany({ _id: { $in: orphanIds } });
  }
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

    // Opt-in sharing: only public resumes are readable by non-owners.
    if (resume && resume.isPublic !== true) {
      const callerId = await getCurrentUserId();
      if (callerId !== resume.userId) {
        return JSON.stringify(null);
      }
    }

    return JSON.stringify(resume);
  } catch (error: any) {
    throw new Error(`Failed to fetch resume: ${error.message}`);
  }
}

/**
 * Whether the current request may view a resume: true if it is public or owned
 * by the caller. Used by the view page to gate private resumes.
 */
export async function canViewResume(resumeId: string) {
  try {
    await connectToDB();

    const resume = await Resume.findOne(
      { resumeId: resumeId },
      { isPublic: 1, userId: 1 }
    );

    if (!resume) {
      return false;
    }
    if (resume.isPublic === true) {
      return true;
    }

    const callerId = await getCurrentUserId();
    return callerId === resume.userId;
  } catch (error: any) {
    console.error(`Failed to check resume visibility: ${error.message}`);
    return false;
  }
}

export async function fetchUserResumes() {
  try {
    const userId = await requireUserId();

    await connectToDB();

    // Newest first: _id encodes creation time, so this is stable creation
    // order (unlike updatedAt, which would reshuffle cards on every edit).
    const resumes = await Resume.find({ userId: userId }).sort({ _id: -1 });

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
    template: string;
    sectionOrder: string[];
    isPublic: boolean;
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
    const previousExperienceIds = resume.experience ?? [];

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

    await deleteOrphans(Experience, previousExperienceIds, experienceIds);

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
    const previousEducationIds = resume.education ?? [];

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

    await deleteOrphans(Education, previousEducationIds, educationIds);

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding or updating education to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function addSkillToResume(resumeId: string, skillDataArray: any) {
  try {
    const resume = await assertResumeOwner(resumeId);
    const previousSkillIds = resume.skills ?? [];

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

    await deleteOrphans(Skill, previousSkillIds, skillIds);

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding or updating skill to resume: ", error);
    return { success: false, error: error?.message };
  }
}

export async function deleteResume(resumeId: string, path: string) {
  try {
    const resume = await assertResumeOwner(resumeId);

    // Cascade: remove the resume's sub-documents so they don't orphan.
    await Promise.all([
      Experience.deleteMany({ _id: { $in: resume.experience ?? [] } }),
      Education.deleteMany({ _id: { $in: resume.education ?? [] } }),
      Skill.deleteMany({ _id: { $in: resume.skills ?? [] } }),
    ]);

    await Resume.findOneAndDelete({ resumeId: resumeId });

    revalidatePath(path);

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete resume: ${error.message}`);
    return { success: false, error: error.message };
  }
}
