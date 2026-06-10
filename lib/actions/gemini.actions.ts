"use server";

import { GoogleGenAI } from "@google/genai";
import { requireUserId } from "../auth";
import { checkAiGenerationAllowed } from "../rateLimit";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-3.1-flash-lite";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export interface AiResult<T = any[]> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Runs a prompt through Gemini after enforcing auth + a per-user rate limit.
 * Returns a structured result so callers can show a friendly message instead
 * of crashing on a thrown error.
 */
async function askGemini(prompt: string): Promise<AiResult> {
  const userId = await requireUserId();

  const { allowed, retryAfterMs } = await checkAiGenerationAllowed(userId);
  if (!allowed) {
    const minutes = Math.ceil(retryAfterMs / 60000);
    return {
      success: false,
      error: `AI limit reached. Try again in about ${minutes} minute${
        minutes === 1 ? "" : "s"
      }.`,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: generationConfig,
    });

    const text = response.text;
    if (!text) {
      return { success: false, error: "Empty response from AI." };
    }

    return { success: true, data: JSON.parse(text) };
  } catch (error: any) {
    console.error(`Gemini request failed: ${error?.message}`);
    return {
      success: false,
      error: "AI generation failed. Please try again.",
    };
  }
}

export async function generateSummary(jobTitle: string): Promise<AiResult> {
  const prompt =
    jobTitle && jobTitle !== ""
      ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be 3-4 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level.`
      : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON objects, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in.`;

  return askGemini(prompt);
}

export async function generateEducationDescription(
  educationInfo: string
): Promise<AiResult> {
  const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 3-4 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`;

  return askGemini(prompt);
}

export async function generateExperienceDescription(
  experienceInfo: string
): Promise<AiResult> {
  const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list: High Activity, Medium Activity, and Low Activity. Each summary should be 3-4 lines long and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You can include <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to further enhance the descriptions. Use example work samples if needed, but do not insert placeholders for me to fill in.`;

  return askGemini(prompt);
}
