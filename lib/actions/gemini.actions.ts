"use server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json", // Change to text/plain
};

async function askGemini(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);

  return result.response.text();
}

export async function generateSummary(jobTitle: string) {
  const prompt =
    jobTitle && jobTitle !== ""
      ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be 3-4 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level.`
      : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON objects, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in.`;

  const result = await askGemini(prompt);

  return JSON.parse(result);
}

export async function generateEducationDescription(educationInfo: string) {
  const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 3-4 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`;

  const result = await askGemini(prompt);

  return JSON.parse(result);
}

export async function generateExperienceDescription(experienceInfo: string) {
  const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list: High Activity, Medium Activity, and Low Activity. Each summary should be 3-4 lines long and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You can include <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to further enhance the descriptions. Use example work samples if needed, but do not insert placeholders for me to fill in.`;

  const result = await askGemini(prompt);

  return JSON.parse(result);
}

export type MotivationLetterParams = {
  cvText: string;
  post: string;
  companyName: string;
};

export const generateMotivationLetter = async ({
  cvText,
  post,
  companyName,
}: MotivationLetterParams): Promise<string> => {
  try {
    const prompt = `Write a professional motivation letter based on the following information:

CV Information:
${cvText}

Position applying for: ${post}
Company: ${companyName}

Instructions:
1. Write the letter in plain text format (not JSON)
2. Use this structure:

   [Company Name]
   [Optional: Company Address]

   Subject: Application for ${post} position

   Dear Hiring Manager,

   [Introduction paragraph]

   [2-3 Body paragraphs]

   [Closing paragraph]

   Sincerely,
   [Name from CV]

3. Focus on relevant skills and experiences from the CV
4. Keep it concise but impactful
5. Use a professional and enthusiastic tone
6. Do not include any JSON formatting or special markers
7. Format as plain text with proper line breaks
8. Do not include any placeholders or brackets
9. Don't let me complete any part of the letter

Please write the complete letter now:`;

    const result = await askGemini(prompt);

    if (!result) {
      throw new Error('No response received from Gemini API');
    }

    // Clean up any potential JSON formatting that might slip through
    try {
      const parsed = JSON.parse(result);
      if (parsed.motivationLetter) {
        const { introduction, body, conclusion } = parsed.motivationLetter;
        return `${introduction}\n\n${body}\n\n${conclusion}`;
      }
    } catch {
      // If parsing fails, it means it's already in plain text format
      return result;
    }

    return result;
  } catch (error) {
    console.error('Error in generateMotivationLetter:', error);
    throw error;
  }
};
